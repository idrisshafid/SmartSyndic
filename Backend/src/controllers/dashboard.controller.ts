import { Request, Response } from "express";
import * as DashboardService from "../services/dashboard.service";

export const getSyndicDashboard = async (
    req: Request , res:Response
)=>{
    try{
   const result = await  DashboardService.getSyndicDashboard(req.user!.id);
    return res.status(200).json({
        success : true,
        message: "The dashboard of Syndic",
        data : result,})
    }catch(error:any){
         return res.status(500).json({
        success : false,
        message: error.message,})
}}

export const getAdminDashboard = async (
    req: Request , res:Response
)=>{
    try{
   const result = await DashboardService.getAdminDashboard();
    return res.status(200).json({
        success : true,
        message: "The dashboard of Admin",
        data : result,})
    }catch(error:any){
         return res.status(500).json({
        success : false,
        message: error.message,})
}}
