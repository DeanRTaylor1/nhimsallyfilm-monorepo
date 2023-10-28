import { Service } from "typedi";
import { File, StorageClient, pathObject } from "./types/upload.types";
import { env } from "@env";
import { LocalDisk } from "./providers/diskUpload.service";

@Service()
export class StorageService<T extends StorageClient> {
  protected disk: T;

  constructor() {
    this.setDisk(env.upload.type);
  }

  setDisk(diskType: string): this {
    switch (diskType) {
      case "local":
        this.disk = new LocalDisk() as unknown as T;
        break;
      //   case "s3":
      //     this.disk = new AWSFileUploader() as unknown as T;
      //     break;
      default:
        throw new Error("Unsupported disk type");
    }
    return this;
  }

  async upload(files: File | Array<File>): Promise<Array<{ path: string }>> {
    return this.disk.upload(files);
  }

  createDirectory(dir: string): void {
    this.disk.createDirectory(dir);
  }

  async getObjectUrl(paths: Array<pathObject>): Promise<Array<string>> {
    return this.disk.getObjectUrl(paths);
  }
}
