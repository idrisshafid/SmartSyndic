import * as apartmentModel from "../models/apartement.models";
import cloudinary from "../config/cloudinary.config";
import { CreateApartmentInput,  UpdateApartmentInput
} from "../types/appartement.types";

import * as uploadService from "./upload.services";

import { SearchFilters  } from "../types/chatbot.types";
import { error } from "node:console";
import * as residenceModel from "../models/residence.models";

export const getAllApartment = async () => {
const apartements= await apartmentModel.getAllApartment();
if (!apartements) {throw new Error ("Apartments not Found") ;}
return apartements;
}

export const getApartmentsByResidence = async (
  residenceId: string
) => {
  // 1. Verify residence exists
  const residence = await residenceModel.getById(residenceId);
  if (!residence) {
    throw new Error("Residence not found");
  }
  // 2. Get apartments
  const apartments =  await apartmentModel.getAllByResidence(residenceId);
  
  return apartments;
};


// ===============================
// GET APARTMENT BY ID
// ===============================
export const getById = async (
  id: string
) => {
  const apartment =
    await apartmentModel.getById(id);
  if (!apartment) {
    throw new Error("Apartment not found");}
  return apartment;};
// ===============================
// CREATE APARTMENT
// ===============================
export const create = async (
  data: CreateApartmentInput
) => {

  if (!data.residence_id) {
    throw new Error(
      "Residence is required"
    );

  } return await apartmentModel.create( data);
};
// ===============================
// UPDATE APARTMENT
// ===============================
export const update = async (
  id: string,
  data: UpdateApartmentInput
) => {
  const apartment =await apartmentModel.update( id,data);
  if (!apartment) {throw new Error(  "Apartment not found"  );}
  return apartment;
};
// ===============================
// DELETE APARTMENT
// ===============================
export const deleteApartment = async (
  id: string
) => {
  const deleted =
    await apartmentModel.deleteApartment(  id );
  if (!deleted) {
    throw new Error(
      "Apartment not found"
    );
  }
  return {
    message: "Apartment deleted successfully"
  };
};
// ===============================
// SEARCH WITH FILTERS
// ===============================
export const searchAvailableApartments = async (
  filters: SearchFilters,
  page: number = 1,
  limit: number = 10
) => {
  // 1. Validation de sécurité pour la pagination
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit)); // Limite max de 100 pour éviter de surcharger la DB
  
  // 2. Calcul de l'offset pour la pagination SQL
  const offset = (safePage - 1) * safeLimit;

 
    // 3. Appel de la fonction du modèle
  const apartments = await apartmentModel.getWithFilters(
    filters,
    safePage,
    safeLimit );
    return apartments;
    }

// ===============================
// ADD PHOTO
// ===============================

export const addPhoto = async (
 
  apartmentId: string , file: Express.Multer.File ) => {

                if (!file) {
              throw new Error(  "Photo is required");  }

    const image = await uploadService.uploadImage( file, 
      uploadService.CLOUDINARY_FOLDERS.APARTMENTS);

  const photo =
await apartmentModel.addPhoto(
    apartmentId,
    image.url,
    image.public_id );
    
      return photo;                      };

// ===============================
// GET PHOTOS
// ===============================
export const getPhotos = async (
  apartmentId: string   ) => {
  return await apartmentModel.getPhotos( apartmentId )       };

// ===============================
// DELETE PHOTO
// ===============================
export const deletePhoto = async (
   photoId: string) => { 

    const photo = await apartmentModel.getPhotoById(photoId)    ;

    if (!photoId) { throw new Error("Photo not found") ;}
    
     await cloudinary.uploader.destroy( photo.public_id);

      await apartmentModel.deletePhoto(photoId);
  return {
    message:
      "Photo deleted successfully"
  };

};

// ===============================
// SET PRIMARY PHOTO
// ===============================
export const setPrimaryPhoto = async (
  apartmentId: string,
  photoId: string
) => {


  const photo =
    await apartmentModel.setPrimaryPhoto(
      apartmentId,
      photoId
    );


  if (!photo) {
    throw new Error(
      "Photo not found"
    );
  }  return photo;

};
//Add Equipment for Apartment
export const addEquipment = async (
  apartmentId: string , equipment: string) => {
  if (!equipment) {
    throw new Error("Equipment is required");}

  return await apartmentModel.addEquipment(
    apartmentId, equipment);
};
//Get Equipements for apartment
export const getEquipments = async (
  apartmentId: string
) => {  return apartmentModel.getEquipments(apartmentId);};
//delete Equipements
export const deleteEquipment = async (
  equipmentId: string
) => { const deleted =
    await apartmentModel.deleteEquipment(equipmentId);

  if (!deleted) {
    throw new Error("Equipment not found");
  }
  return {
    message: "Equipment deleted successfully"};};