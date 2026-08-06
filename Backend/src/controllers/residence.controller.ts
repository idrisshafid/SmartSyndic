import { Request, Response } from "express";
import * as residenceService from "../services/residence.services";
import {updateResidenceSchema} from "../validators/residence.schema"

//Upload photo for residences
export const uploadPhoto=async(req: Request<{ id: string }>, 
  res: Response)=>{
try{ 
  
    const result= await residenceService.uploadPhoto(req.params.id,req.file! );

return res.status(201).json({
success:true,
data:result });

}catch(error:any){

return res.status(400).json({
success:false,
message:error.message });
}};
///////////////////////////////////

export const getPhoto = async (
  req: Request <{id:string}>,
  res: Response
) => {
  try {

    const result = await residenceService.getPhoto(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};
/////////////////////////////////////////////////
//update photo
export const deletePhoto = async (
 req: Request<{photoId:string}>,
 res: Response
) => {

 try {

   const deletedPhoto =
     await residenceService.deletePhoto(req.params.photoId);

   res.status(200).json({
     success:true,
     message:"Photo deleted successfully",

   });


 } catch(error:any) {


   res.status(404).json({

     success:false,

     message:error.message

   });

 }

};
  //GET /residences : Residences of the authenticated syndic
export const getAllForSyndic = async (
  req: Request ,
  res: Response
) => {
  try {
    const syndicId = req.user!.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await residenceService.getAllForSyndic(
      syndicId,
      { page, limit }
    );

    return res.status(200).json({
      success: true,
      message: "Residences retrieved successfully",
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

//GET /public/residences
 //Public residences for visitors

export const getPublic = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await residenceService.getPublic(
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Public residences retrieved successfully",
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

//GET /residences/:id
export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const result = await residenceService.getById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Residence retrieved successfully",
      data: result,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};
//================================
// POST / residences
 //===================================
export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const syndicId = req.user!.id;

    const result = await
     residenceService.create(syndicId, req.body);

    return res.status(201).json({
      success: true,
      message: "Residence created successfully",
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};
//update residence
export const update = async (
  req: Request<{ id: string }>,
  res: Response) => {
  try {
    const data = updateResidenceSchema.parse(req.body);
    const syndicId = req.user!.id;
    const result = await residenceService.update( req.params.id,    syndicId,  data);
     console.log("BODY:", req.body);

    return res.status(200).json({
      success: true,
      message: "Residence updated successfully",
      data: result,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    }); }};

// DELETE /residences/:id
 
export const deleteResidence = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const syndicId = req.user!.id;
    const result = await residenceService.deleteResidence(
      req.params.id,
      syndicId
    );

    return res.status(200).json({
      success: true,
      message: "Residence deleted successfully",
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};