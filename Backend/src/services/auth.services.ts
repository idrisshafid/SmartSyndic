import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
//import from Folder 
import {  findByEmail, create, updateResetToken, findById ,
   findByResetToken, updatePassword,  revokeToken    }  from "../models/user.models";
import { RegisterInput, LoginInput, } from "../types/auth.types";
import { AuthPayload } from "../types/user.types";
import { sendResetEmail } from "./email.services";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async ( password: string , hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = ( payload: AuthPayload ): string => {
  return jwt.sign ( payload  , process.env.JWT_SECRET as string, 
 { expiresIn: "7d", }  ) ;
};

export const register = async (data: RegisterInput) => {

  //check if user already exists
  const existingUser = await findByEmail(data.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await create({
    ...data, password: hashedPassword , });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,});

  return { user ,  token,};
};

//me

export const me = async(     userId:string       )=>{

const user = await findById (userId); 

if(!user) { throw new Error( "User not found" ); }

return user; };
//logout

export const logout = async(

token:string ,  expiresAt:Date   )=>{

await revokeToken( token , expiresAt );

return { message:"Logged out successfully"

};  };

export const login = async (data: LoginInput) => {
  const user = await findByEmail(data.email);

  if (!user) {
    throw new Error("Invalid email or password");  }
  
  const isMatch = await comparePassword( data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
 return { user , token , };  };


 //forget password

export const forgotPassword = async (email: string) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await updateResetToken(user.id, resetToken, expires);

   await sendResetEmail(email , resetToken );

  return {
    message: "Reset token generated",
  
    resetToken  , expires,  }; };
  
    //reset password

  export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const user = await findByResetToken(token);

  if (!user) {
    throw new Error("Invalid or expired token")   ;  }

  const hashedPassword = await hashPassword(newPassword);

  await updatePassword(user.id, hashedPassword);

  await updateResetToken(user.id, null, null);

  return {
    message: "Password updated successfully",
  };
};