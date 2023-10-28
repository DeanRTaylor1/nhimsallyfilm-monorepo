import { NextApiRequest, NextApiResponse } from "next";
import { dynamoDBSingleton } from "../../lib/aws/aws-dynamo.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    try {
      dynamoDBSingleton.getInstance();
      const data = await dynamoDBSingleton.getInstance().getAllCoverImages();
      // console.log(data);
      res.status(200).json(data);
    } catch (error: any) {
      console.log(error);
      res
        .status(500)
        .json({ error: `Error getting album covers: ${error.message}` });
    }
  }
}
