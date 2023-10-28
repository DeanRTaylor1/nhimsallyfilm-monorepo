import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import sharp from "sharp";
import formidable from "formidable";
import { uploadBlogCoverImage } from "../../../lib/utils/imageHelpers";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not Authenticated!" });
      return;
    }
    const form = new formidable.IncomingForm();
    try {
      form.parse(req, async function (err, fields, files) {
        await saveFile(files.file);
      });
      const blob = new Blob([fs.readFileSync("./tmp/coverimage.jpeg")]);
      const uri = await uploadBlogCoverImage("test1", blob);
      console.log(uri);
      res.status(200).json({ message: "success", uri });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  }
}

const saveFile = async (file: any) => {
  console.log(file.filepath);
  const data = fs.readFileSync(file.filepath);
  sharp(data)
    .resize(541, 800)
    .toFormat("jpeg")
    .toBuffer()
    .then((data) => {
      fs.writeFileSync(`./tmp/coverimage.jpeg`, data);
      console.log("file saved");
    });
  fs.unlinkSync(file.filepath);
  return;
};
//
