export const FileEnum = {
  MAX_SIZE_IMAGE: 10 * 1024 * 1024, //10MB
  MAX_SIZE_VIDEO: 200 * 1024 * 1024, //200MB
  MAX_QTY_IMAGE: 5,
  MAX_QTY_VIDEO: 1,
  MAX_QTY_AUDIO: 1,
  MAX_SIZE_AUDIO: 10 * 1024 * 1024, //10MB roughly 30s of audio in mp3/m4a/mp4 at 125kbps
} as const;
