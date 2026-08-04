import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";


// ======================================
// Generic Zod Validation Middleware
// ======================================

export const validate =   (schema: ZodSchema

) => {

return (
  req: Request,
  res: Response,
  next: NextFunction
) => {


try {

const result = schema.parse(req.body);

// replace body with validated data
req.body = result;

next();

}catch(error:any){

return res.status(422).json({

success:false,

message:"Validation failed",

errors:  error.flatten().fieldErrors


});

}};};