import path from "path";
import * as fs from "fs";
import { env } from "@env";
import { File } from "../types/upload.types";
import { logger } from "@lib/debug/logger";
import { generateFileName } from "@lib/upload/utils";

export class LocalDisk {
  private root = env.appPath + env.upload.disksDir;

  public async upload(files: File | Array<File>) {
    try {
      if (Array.isArray(files)) {
        const paths = [];
        await Promise.all(
          files.map(async (file) => {
            const imgName = generateFileName(file.originalname);
            await this.uploadFile({
              filePath: imgName,
              content: file.buffer as Buffer,
            });
            paths.push({
              path: imgName,
            });
          })
        );
        return paths;
      }
      const path = await this.uploadFile({
        filePath: files.originalname,
        content: files.buffer as Buffer,
      });
      return [
        {
          path,
        },
      ];
    } catch (e) {
      logger.error(`[Local storage upload error] ${e.stack || e}`);
      return [];
    }
  }

  public async uploadFile({
    filePath,
    content,
    encoding,
  }: {
    filePath: string;
    content: string | Buffer;
    encoding?: string;
  }): Promise<void> {
    const newFilePath = this.root + "/" + filePath;
    return new Promise<void>((resolve, reject) => {
      if (!newFilePath || !newFilePath.trim())
        return reject(new Error("The path is required!"));
      if (!content) return reject(new Error("The content is required!"));

      const dir = path.dirname(newFilePath);
      if (!fs.existsSync(dir)) {
        this.createDirectory(dir);
      }

      if (dir === newFilePath.trim()) {
        return reject(new Error("The path is invalid!"));
      }
      fs.writeFile(
        newFilePath,
        content,
        { encoding } as fs.WriteFileOptions,
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

  public createDirectory(dir: string): void {
    const splitPath = dir.includes("//") ? dir.split("//") : dir.split("/");
    if (splitPath.length > 20) {
      throw new Error("The path is invalid!");
    }

    splitPath.reduce((path, subPath) => {
      let currentPath;
      if (subPath !== "." && path) {
        currentPath = path + "/" + subPath;
        if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
      } else {
        currentPath = subPath;
      }
      return currentPath;
    }, "");
  }

  public async getObjectUrl(paths): Promise<Array<string>> {
    const urls = [];
    paths.map((path) => {
      urls.push(env.apiUrl + "/uploads/" + path.path);
    });

    return urls;
  }
}
