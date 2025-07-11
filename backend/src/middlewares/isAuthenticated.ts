import { AuthReq, User, UserReq } from "../interfaces/UserReq";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req: UserReq, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;

    if (!decoded) {
      return res.status(401).json({ status: false, message: "Invalid token" });
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
}
