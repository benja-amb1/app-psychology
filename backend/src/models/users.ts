import { Schema, model } from "mongoose";

interface UserInterface {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
  },
  { versionKey: false, timestamps: true }
);

export default model<UserInterface>('User', UserSchema, 'users');
