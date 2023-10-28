import mongoose, { Schema, SchemaType } from "mongoose";

interface UserSchema {
  email: string;
  password: string;
  name: string;
  role: string;
}

const userSchema = new Schema<UserSchema>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
