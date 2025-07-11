import { Schema, Types, model } from "mongoose";

interface PostInterface {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  year: string;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
}

const PostSchema = new Schema<PostInterface>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    year: { type: String, required: true },
    comments: [{ type: Types.ObjectId, ref: 'User' }],
    likes: [{ type: Types.ObjectId, ref: 'User' }]
  },
  { versionKey: false, timestamps: true }
);

export default model<PostInterface>('Post', PostSchema, 'posts');
