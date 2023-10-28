// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//comment
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/User";
import connectMongo from "../../mongoose/connectMongo";
import bcrypt from "bcryptjs";
import { Data, StatusError } from "../../lib/types/interfaces";
import { hashPassword } from "../../lib/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    //console.log(name, email, password);

    try {
      console.log("CONNECTING TO MONGO");
      await connectMongo();
      console.log("CONNECTED TO MONGO");
      const existingUser = await User.findOne({ name: name });
      if (existingUser) {
        const error = new StatusError("Username already in use.");
        error.statusCode = 409;
        throw error;
      }
      const hashedPw = await hashPassword(password);

      const user = await new User({
        email,
        password: hashedPw,
        name,
      });
      const result = user.save();
      console.log(user);
      res.status(201).json({ message: "User created", userId: user._id });
      return;
    } catch (err: any) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  } else {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");
    const user = await User.findOne({ email: "deanrtaylor@hotmail.com" });
    console.log(user, user.password);
    res.status(200).json({ message: "success!" });
  }
}
