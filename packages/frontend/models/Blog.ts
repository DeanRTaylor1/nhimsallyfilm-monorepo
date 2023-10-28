import mongoose, { Schema } from "mongoose";

export interface BlogSchema {
  title: string;
  imageUri: string;
  description: string;
  content: string;
  timestamps: any;
}

const blogSchema = new Schema<BlogSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    imageUri: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  },
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
