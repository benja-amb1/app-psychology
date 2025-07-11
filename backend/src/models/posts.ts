import { Schema, Types, model } from "mongoose";

interface PostInterface {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  content: string;
  year: string;
  likes: Types.ObjectId[];
}

const PostSchema = new Schema<PostInterface>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    year: { type: String, required: true },
    likes: [{ type: Types.ObjectId, ref: 'User' }]
  },
  { versionKey: false, timestamps: true }
);

export default model<PostInterface>('Post', PostSchema, 'posts');
