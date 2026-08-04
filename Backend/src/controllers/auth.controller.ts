import { Request, Response } from "express";
import * as authService from "../services/auth.services";

export const register = async (req: Request, res: Response) => {

    console.log("➡️ Register endpoint called");
      console.log(req.body.role);
  try {

    const result = await authService.register(req.body);
  

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    }); }
      catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true, 
      message: "Login successful",
      data: result,
    } ) ;  }
     catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.forgotPassword(req.body.email);

    return res.status(200).json({
      success: true,
      message: "Reset link sent",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
//me : getbyid
export const me = async(

  req:Request,res:Response)=>{

try{

const user =await authService.me(req.user!.id);

res.status(200).json({
success:true,
data:user
});

}catch(error:any){
res.status(404).json({
success:false,
message:error.message             });}};
//logout
export const logout = async(

req:Request , res:Response)=>{

try{

const token = req.headers.authorization ?.split(" ")[1];

if(!token){

return res.status(401).json({

message:"Token missing"  });   }

const decoded:any =req.user;

await authService.logout

( token , new Date(decoded.exp * 1000));


res.status(200).json({
success:true,
message:"Logged out successfully"
});


}  catch(error:any)  {

res.status(500).json ( {
message:error.message})

;}};



export const getuserbyid = async(

  req:Request<{id:string}>,res:Response)=>{

try{
  const id = req.params.id

const user =await authService.me(id);

res.status(200).json({
success:true,
data:user
});

}catch(error:any){
res.status(404).json({
success:false,
message:error.message             });}};