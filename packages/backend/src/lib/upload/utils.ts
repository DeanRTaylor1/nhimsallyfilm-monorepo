import { Options, FileFilterCallback } from "multer";
import { HttpException } from "@api/core/errors/HttpException";
import { StatusCodeEnum } from "@api/core/enum/api.enum";
import { Request } from "express";
import * as crypto from "crypto";

export function createFileUploadOption({
  mimetype,
  fileSize,
  maxFilesPerUpload,
}: {
  mimetype: RegExp;
  fileSize: number;
  maxFilesPerUpload: number;
}): Options {
  const imgUploadOptions: Options = {
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      if (file.mimetype.match(mimetype)) {
        cb(null, true);
      } else {
        cb(
          new HttpException({
            status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
            message: "Unsupported file type",
          })
        );
      }
    },
    limits: {
      fileSize: fileSize, // max file size
      files: maxFilesPerUpload, // max of five files at a time
    },
  };

  return imgUploadOptions;
}

export const generateFileName = (oldFileName: string): string => {
  const fileNameToArray = oldFileName.split(".");
  const filExtName = fileNameToArray.pop();
  const fileNameHash = crypto
    .createHash("md5")
    .update(fileNameToArray.join(""))
    .digest("hex")
    .toString();
  return `${fileNameHash}_${Date.now()}.${filExtName}`;
};
