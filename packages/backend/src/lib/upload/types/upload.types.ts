export interface File {
  originalname: string;
  size: number;
  mimetype: string;
  extension: string;
  buffer: ArrayBuffer;
}

export interface UploadedFile {
  path: string;
}

export type pathObject = { path: string };

export interface StorageClient {
  upload(files: File | Array<File>): Promise<Array<pathObject>>;
  createDirectory(dir: string): void;
  getObjectUrl(paths: Array<pathObject>): Promise<Array<string>>;
}
