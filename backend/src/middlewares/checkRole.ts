import { NextFunction, Response } from "express"
import { UserReq } from "../interfaces/UserReq"

export const checkRole = (...roles: string[]) => {
  return (req: UserReq, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(404).json({ status: false, message: "Not user provided" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(404).json({ status: false, message: "No role include." });
      return;
    }
    next();

  }
}

// checkRole('admin')