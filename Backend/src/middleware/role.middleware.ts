import { Request, Response, NextFunction } from "express";

export const authorize =(
    ...roles: string[]) =>
      
(req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      console.log(req.user);
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      }); }

    if (!roles.includes(user.role)) {
      console.log(req.user?.role);
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };