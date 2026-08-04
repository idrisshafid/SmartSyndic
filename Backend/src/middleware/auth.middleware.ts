import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../database/db";

export const verifyToken = async(
  req: Request, res: Response,
  next: NextFunction ) => {
  try {
    // Lire le header Authorization
    const authHeader = req.headers.authorization;

    // Vérifier si le header existe
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing", });}

    // Vérifier le format : Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      }); }

   //  Vérifier si token est blacklisté

      const revoked = await pool.query( `

        SELECT id  FROM revoked_tokens
        WHERE token=$1   `,   [token]  );

    if(revoked.rows.length > 0){

     return res.status(401).json({
     message:"Token has been revoked"
       });  }

    // Vérifier le JWT
    const decoded = jwt.verify( token , process.env.JWT_SECRET as string );

    // Attacher l'utilisateur à la requête
    (req as any).user = decoded;

    // Continuer vers le controller
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
