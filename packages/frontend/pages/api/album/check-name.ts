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

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { albumName } = req.query;
  try {
    const dynamoDb = dynamoDBSingleton.getInstance();
    const images = await dynamoDb.getAlbumByName(albumName as string);
    const exists = images.length > 0;

    res.status(202).json({ exists });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default apiRoute;
