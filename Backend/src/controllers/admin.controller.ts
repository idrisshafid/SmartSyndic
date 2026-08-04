import { Request, Response } from "express";
import * as adminService from "../services/admin.services";


// ======================================
// GET ALL SYNDICS
// GET /admin/syndics
// ======================================
export const getAllSyndics = async (
  req: Request,
  res: Response
) => {

  try {
    const syndics =
      await adminService.getAllSyndics(
        {   page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 10});

    return res.status(200).json({
      success: true,
      data: syndics
    });

  } catch(error:any) {

    return res.status(500).json({
      success:false,
      message:error.message
   
    });}
};


// ======================================
// CREATE SYNDIC
// POST /admin/syndics
// ======================================
export const createSyndic = async (
  req: Request,
  res: Response
) => {

  try {

    const syndic =
      await adminService.createSyndic( req.body);

    return res.status(201).json({
      success:true,
      message:"Syndic created successfully",
      data: syndic
    });



  } catch(error:any) {

    return res.status(400).json({
      success:false,
      message:error.message});
}};

// ======================================
// TOGGLE STATUS
// PATCH /admin/syndics/:id
// ======================================
export const toggleStatus = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {
    const syndic =
      await adminService.toggleStatus(
        
        req.params.id  ,   req.body.is_active     );

    return res.status(200).json({
      success:true,
      message:"Syndic status updated",
      data: syndic
    });

  } catch(error:any) {

    return res.status(400).json({
      
        success:false,
      message:error.message
                                 });

  }

};