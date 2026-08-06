import * as residenceModel from "../models/residence.models";
import cloudinary from "../config/cloudinary.config";

import {
  CreateResidenceInput,
  UpdateResidenceInput,
} from "../types/residence.types";

import * as uploadService from "./upload.services";

import { PaginationQuery } from "../types/api.types";

export const uploadPhoto = async(residenceId:string,
   file:Express.Multer.File)=>{

   if(!file){
  throw new Error("Image required"); }

       const image = await uploadService.uploadImage( file, 
      uploadService.CLOUDINARY_FOLDERS.RESIDENCES);
     
   const photo= await residenceModel.addPhoto( residenceId, image.url,
    image.public_id );
    return photo;
   };

     export const getPhoto = async(residenceId:string)=>{

   const photo= await residenceModel.getPhotos( residenceId );

    if (!photo) { 
      throw new Error   (  "photo not found." );  }
       return photo;
   };


export const deletePhoto = async (
  photoId: string
) => {
  // 1. Get photo information
  const photo = await residenceModel.getPhotobyid(photoId);
  if (!photo) {
    throw new Error("Photo not found");}
  
    // 2. Delete image from Cloudinary
  await cloudinary.uploader.destroy( photo.public_id);

  // 3. Delete database record
  const deletedPhoto =
    await residenceModel.deletePhoto(photoId);
    
  return deletedPhoto;
};


//Get all residences of one syndic
export const getAllForSyndic = async (
  syndicId: string,
  pagination: PaginationQuery
) => {
  return await residenceModel.getAll(
    syndicId,
    pagination.page,
    pagination.limit
  );
};

//Public list (visitors)
export const getPublic = async (
  page: number = 1,
  limit: number = 10
) => {
  const result = await residenceModel.getAllPublic(
    page,
    limit
  );
  return result;
};

// Create residence
export const create = async (
  syndicId: string,
  data: CreateResidenceInput
) => {
  return await residenceModel.create({
    ...data,
    syndic_id: syndicId,
  });
 
};

//Update residence
export const update = async (
  residenceId: string,
  syndicId: string,
  data: UpdateResidenceInput
) => {
  const isOwner = await residenceModel.checkOwnership( residenceId, syndicId);

  if (!isOwner) {
    throw new Error(   "You are not allowed to modify this residence." ); }

  const residence =
    await residenceModel.update(
      residenceId,  data);

  if (!residence) {
    throw new Error(
      "Residence not found."
    );
  }
  return residence;
};

// Delete residence
export const deleteResidence = async (
  residenceId: string,
  syndicId: string
) => {

  const isOwner =  await residenceModel.checkOwnership( residenceId, syndicId );

  if (!isOwner) {
    throw new Error(
      "You are not allowed to delete this residence."
    ); }

  const deleted =await residenceModel.deleteResidence(residenceId );

  if (!deleted) {
    throw new Error(
      "Residence not found." ); }
  return {
    message: "Residence deleted successfully.",
  };
};
export const getById = async ( id: string
) => { const residence = await residenceModel.getById(id);
    return residence; };