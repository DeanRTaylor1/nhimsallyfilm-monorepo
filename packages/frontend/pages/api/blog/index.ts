import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../mongoose/connectMongo";

import { getSession } from "next-auth/react";
import Blog from "../../../models/Blog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not Authenticated!" });
      return;
    }
    //const session = await getSession({ req: req });
    //if (!session) {
    //res.status(401).json({ message: "Not Authenticated!" });
    //return;
    //}

    const title = req.body.title;
    //TODO UPDATE IMAGEURI TO ACTUAL IMAGEURI
    const imageUri = req.body.imageuri;
    const description = req.body.description;
    const content = req.body.content;
    try {
      console.log("CONNECTING TO MONGO");
      await connectMongo();
      console.log("CONNECTED TO MONGO");

      const blogPost = await new Blog({
        title,
        imageUri,
        description,
        content,
      });
      const result = await blogPost.save();
      console.log(blogPost);
      res
        .status(201)
        .json({ message: "Blog Post Uploaded", blogPost: blogPost.toJSON });
      return;
    } catch (err: any) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
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
      if (req.headers.page && isNaN(+req.headers.page)) {
        res.status(500).json({ message: "Something went wrong." });
        return;
      }
      const page: number = +req.headers.page! || 0;

      const blogs = await Blog.find()
        .sort({ createdAt: "desc" })
        .skip(5 * page)
        .limit(5);
      // console.log(images);
      const count = await Blog.count();

      res.status(200).json({ message: "success", blogs: blogs, count });
      return;
    } catch (err: any) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
  if (req.method === "DELETE") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not Authenticated!" });
      return;
    }
    try {
      console.log("CONNECTING TO MONGO");
      await connectMongo();
      console.log("CONNECTED TO MONGO");
      if (!req.headers.imageuri) {
        res.status(500).json({ message: "Something went wrong." });
        return;
      }
      console.log(req.headers.imageuri);
      const blog = await Blog.findOneAndDelete({
        imageUri: req.headers.imageuri,
      });
      console.log(blog);
      res.status(200).json({ message: "success", blog: blog });
      return;
    } catch (err: any) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
}
