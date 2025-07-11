import { Schema, Types, model } from "mongoose";

const CommentSchema = new Schema({
  postId: { type: Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true }
}, { versionKey: false, timestamps: true });

export default model('Comment', CommentSchema);
