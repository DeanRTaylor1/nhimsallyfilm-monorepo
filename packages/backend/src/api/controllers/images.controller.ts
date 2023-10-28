import { BaseController } from "./base.controller";
import { HandleErrors } from "@core/decorators/errorHandler.decorator";
import ImagesRepository from "@api/domain/images/images.repository";
import Image from "@api/models/entities/Image.entity";

import { Request, Response } from "express";
import {
  Get,
  JsonController,
  Req,
  Res,
} from "routing-controllers";
import { Service } from "typedi";

@JsonController("/images")
@Service()
class ImagesController extends BaseController {
  constructor(
    protected imagesRepository: ImagesRepository,
  ) {
    super();
  }

  @Get("/banner")
  @HandleErrors
  public async getBanner(
    @Req() _: Request,
    @Res() res: Response
  ): Promise<Response> {
    const images = await this.imagesRepository.getTenRandomImages();

    return this.responseSuccess<Array<Image>>({
      data: images,
      message: "Success",
      res,
    });
  }


}

export { ImagesController };
