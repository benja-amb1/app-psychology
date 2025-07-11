import { Request } from 'express';
import { Types } from 'mongoose';

export interface User {
  id: Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export interface UserReq extends Request {
  user?: User;
}

export interface AuthReq extends Request {
  user: User;
}
