import NextAuth from "next-auth";
import User from "../../../models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../mongoose/connectMongo";
import { StatusError } from "../../../lib/types/interfaces";
import mongoose from "mongoose";
import { verifyPassword } from "../../../lib/utils/auth";

interface Credentials {
  email: string;
  password: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "jsmith@google.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");
        const user = await User.findOne({ email: credentials!.email });
        if (!user) {
          const error = new StatusError("No username found.");
          error.statusCode = 409;
          throw error;
        }
        const isValid = await verifyPassword(
          credentials!.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        return {
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.SECRET_KEY,
  pages: {
    signIn: "/admin",
  },
});

//updated
