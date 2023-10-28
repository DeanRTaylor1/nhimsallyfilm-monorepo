import mongoose, { Schema } from "mongoose";

export interface ImageSchema {
  albumName: string;
  imageUri: string;
  imageName: string;
  isAlbumCover: Boolean;
}

const imageSchema = new Schema<ImageSchema>({
  albumName: {
    type: String,
    required: true,
  },
  imageUri: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    required: false,
  },
  isAlbumCover: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Image || mongoose.model("Image", imageSchema);
