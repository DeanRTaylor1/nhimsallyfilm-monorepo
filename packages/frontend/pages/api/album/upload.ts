import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { dynamoDBSingleton } from "../../../lib/aws/aws-dynamo.js";
import { awsS3Singleton } from "../../../lib/aws/aws-s3";
import { compressImage } from "../../../lib/services/compress-image";
import { authMiddleware } from "../../../lib/services/auth-middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

const s3 = awsS3Singleton.getInstance();

interface MulterRequest extends NextApiRequest {
  files: any[];
}

const apiRoute = nextConnect({
  onError(error, _req: NextApiRequest, res: NextApiResponse) {
    console.error(error.stack);
    res
      .status(501)
      .json({ error: `Sorry, something went wrong: ${error.message}` });
  },
});

apiRoute.use(authMiddleware);
apiRoute.use(upload.array("images"));

apiRoute.post(async (req: MulterRequest, res: NextApiResponse) => {
  console.log(req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Files not provided" });
  }

  try {
    const imageUrls = await Promise.all(
      req.files.map(async (file, index) => {
        const metadata = JSON.parse(req.body.metadata[index]);

        console.log("metadata: ", metadata);

        const compressedFile = await compressImage(file);
        const key = s3.createKey(
          req.body.albumName,
          req.body.packageName,
          compressedFile
        );

        const imageUrl = await s3.uploadToS3(
          compressedFile,
          req.body.albumName,
          req.body.packageName,
          key
        );
        return { imageUrl, metadata, key };
      })
    );

    const oldDomain = "nhimsallyfilmsite.s3.ap-southeast-1.amazonaws.com";
    const newDomain = "d3cptuexqel1lc.cloudfront.net";

    const awsImages = imageUrls.map((imageUrl, index) => ({
      ...imageUrl.metadata,
      imageUri: imageUrl.imageUrl,
      key: imageUrl.key,
      packageName: req.body.packageName,
      cloudFrountUri: imageUrl.imageUrl.replace(oldDomain, newDomain),
    }));

    const dynamoDb = dynamoDBSingleton.getInstance();

    for (const awsImage of awsImages) {
      await dynamoDb.addItem(awsImage);
    }

    res.status(200).json({ imageUrls });
  } catch (error: any) {
    res.status(500).json({ error: `Error uploading files: ${error.message}` });
  }
});

export default apiRoute;
