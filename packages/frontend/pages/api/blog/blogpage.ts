// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//comment
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../mongoose/connectMongo";
import { Data } from "../../../lib/types/interfaces";
import Image from "../../../models/Image";

import { getSession } from "next-auth/react";
import Blog from "../../../models/Blog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not Authenticated!" });
      return;
    }
    try {
      console.log("CONNECTING TO MONGO");
      await connectMongo();
      console.log("CONNECTED TO MONGO");
      if (!req.headers.title) {
        res.status(500).json({ message: "Something went wrong." });
        return;
      }
      const title = req.headers.title;
      console.log(title);

      const blog = await Blog.findOne({ title: title });
      console.log(blog);

      res.status(200).send({ message: "success", blog: blog });
      return;
    } catch (err: any) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}
