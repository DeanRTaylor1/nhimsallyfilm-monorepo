import {
  CompleteMultipartUploadOutput,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

export class awsS3Singleton {
  private static instance: awsS3Singleton;
  private s3: S3Client;
  private bucket: string;

  private constructor() {
    this.s3 = new S3Client({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.AWS_NS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_NS_SECRET_KEY!,
      },
    });
    this.bucket = "nhimsallyfilmsite";
  }

  public createKey(
    albumName: string,
    packageName: string,
    file: Express.Multer.File
  ): string {
    const ext = file.originalname.split(".").pop();
    return `${packageName}/${albumName}/${uuidv4()}.${ext}`;
  }

  public static getInstance(): awsS3Singleton {
    if (!awsS3Singleton.instance) {
      awsS3Singleton.instance = new awsS3Singleton();
    }

    return awsS3Singleton.instance;
  }

  public async uploadToS3(
    file: Express.Multer.File,
    albumName: string,
    packageName: string,
    Key: string
  ): Promise<string> {
    // // console.log(albumName, packageName);
    // console.log(file.originalname);
    const ext = file.originalname.split(".").pop();
    // console.log(ext);
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key,
        Body: file.buffer,
      },
    });

    try {
      const data = (await upload.done()) as CompleteMultipartUploadOutput;
      if ("Location" in data) {
        return data.Location!;
      } else {
        console.error("Upload was aborted");
        throw new Error("Upload was aborted");
      }
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
      throw error;
    }
  }

  public async deleteFromS3(key: string): Promise<void> {
    try {
      const data = await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
      );
      console.log("Success. Object deleted.", data);
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
      throw error;
    }
  }
}
