import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { authMiddleware } from "../../../lib/services/auth-middleware";
import { awsS3Singleton } from "../../../lib/aws/aws-s3";
import { awsImage } from "../../../lib/types/aws-types";
import { dynamoDBSingleton } from "../../../lib/aws/aws-dynamo.js";

const apiRoute = nextConnect({
  onError(error, _req: NextApiRequest, res: NextApiResponse) {
    console.error(error.stack);
    res
      .status(501)
      .json({ error: `Sorry, something went wrong: ${error.message}` });
  },
});

apiRoute.use(authMiddleware);

apiRoute.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const { albumId } = req.query;
  try {
    const dynamoDb = dynamoDBSingleton.getInstance();
    const s3 = awsS3Singleton.getInstance();

    // Fetch all images in the album
    const albumImages = await dynamoDb.getAllAlbumImages(albumId as string);

    // Delete all images from S3 and DynamoDB
    await Promise.all(
      albumImages.map(async (image: awsImage) => {
        await s3.deleteFromS3(image.key);
        await dynamoDb.deleteItem(image.imageId);
      })
    );

    res.status(202).json({ message: "Deleted album: " + (albumId as string) });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default apiRoute;
