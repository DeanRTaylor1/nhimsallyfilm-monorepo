import authMiddleware from "@middlewares/auth.middleware";
import { BaseController } from "./base.controller";

import {
  JsonController,
  Post,
  UseBefore,
  UploadedFiles,
  Res,
} from "routing-controllers";
import { Service } from "typedi";
import { File } from "@lib/upload/types/upload.types";
import { FileEnum } from "@lib/upload/upload.enum";
import { Response } from "express";
import { StorageService } from "@lib/upload/upload.service";
import { HandleErrors } from "@api/core/decorators/errorHandler.decorator";
import { createFileUploadOption } from "@lib/upload/utils";

@JsonController("/upload")
@Service()
export class UploadController extends BaseController {
  @Post("/image")
  @UseBefore(authMiddleware())
  @HandleErrors
  async uploadImage(
    @UploadedFiles("files", {
      options: createFileUploadOption({
        mimetype: /\/(jpg|jpeg|png|webp)$/,
        fileSize: FileEnum.MAX_SIZE_IMAGE,
        maxFilesPerUpload: FileEnum.MAX_QTY_IMAGE,
      }),
    })
    files: File | Array<File>,
    @Res() res: Response
  ) {
    const storageService = new StorageService();
    const paths = await storageService.upload(files);
    const data = await storageService.getObjectUrl(paths);
    return this.responseSuccess<Array<string>>({ data, message: "", res });
  }

  @Post("/video")
  @UseBefore(authMiddleware())
  @HandleErrors
  async uploadVideo(
    @UploadedFiles("files", {
      options: createFileUploadOption({
        mimetype: /\/(quicktime|mp4|webm)$/,
        fileSize: FileEnum.MAX_SIZE_VIDEO,
        maxFilesPerUpload: FileEnum.MAX_QTY_VIDEO,
      }),
    })
    files: Array<File>,
    @Res() res: Response
  ) {
    const storageService = new StorageService();
    const paths = await storageService.upload(files);

    const data = await storageService.getObjectUrl(paths);
    return this.responseSuccess<Array<string>>({
      data,
      message: "Success.",
      res,
    });
  }

  @Post("/audio")
  @UseBefore(authMiddleware())
  @HandleErrors
  async uploadAudio(
    @UploadedFiles("files", {
      options: createFileUploadOption({
        mimetype: /^(audio\/mp3|audio\/mpeg|audio\/mp4)$/,
        fileSize: FileEnum.MAX_SIZE_AUDIO,
        maxFilesPerUpload: FileEnum.MAX_QTY_AUDIO,
      }),
    })
    files: File | Array<File>,
    @Res() res: Response
  ) {
    const storageService = new StorageService();
    const paths = await storageService.upload(files);

    const data = await storageService.getObjectUrl(paths);
    return this.responseSuccess<Array<string>>({
      data,
      message: "Success",
      res,
    });
  }
}
