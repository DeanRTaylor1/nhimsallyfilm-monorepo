import sharp from "sharp";

export async function compressImage(file: Express.Multer.File) {
  // Read the image
  const buffer = file.buffer;

  // Resize the image
  const resizedBuffer = await sharp(buffer)
    .resize({ width: 797, height: 1200, fit: "inside" })
    .jpeg({ quality: 80 })
    .toBuffer();

  // Get the image size
  const { width, height } = await sharp(resizedBuffer).metadata();

  if (width === 1062 || height === 1800) {
    console.log("Image is compressed");
  }

  // Get the file size
  const fileSize = resizedBuffer.byteLength;

  console.log(
    "Successfully resized",
    file.originalname,
    ". New image height:",
    height,
    ", resized image width:",
    width,
    ". File size:",
    fileSize,
    "bytes"
  );

  file.buffer = resizedBuffer;

  return file;
}
