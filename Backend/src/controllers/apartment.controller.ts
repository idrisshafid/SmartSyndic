import { Request, Response } from "express";
import { SearchFilters   } from "../types/chatbot.types";

import * as apartmentService from "../services/apartement.services";
import { searchWithFilters } from "../models/chatbot.models";

export const getAllApartment = async (
 req: Request,
 res: Response
) => {

 try {
   const apartments = await apartmentService.getAllApartment();

   res.status(200).json({
     success:true,
     message:"Apartments retrieved successfully",
     data:apartments
   });
 } catch(error:any) {
   res.status(404).json({
     success:false,
     message:error.message  }); } }

export const getApartmentsByResidence = async (
 req: Request< {residenceId:string} >,
 res: Response
) => {

 try {
   const apartments =
     await apartmentService.getApartmentsByResidence(  req.params.residenceId);

   res.status(200).json({
     success:true,
     message:"Apartments retrieved successfully",
     data:apartments
   });

 } catch(error:any) {
   res.status(404).json({
     success:false,
     message:error.message  });
 }

};
// =================================
// GET /apartments/:id
// Get one apartment
// =================================
export const getById = async (
  req: Request<{ id: string }>,
  res: Response ) => { 
    try {
    const apartment =await apartmentService.getById(req.params.id);

    return res.status(200).json({
      success: true,
      data: apartment
    });


  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

};
// =================================
// GET /apartments/search
// Filters
// =================================

export const searchAvailableApartments = 
async (req: Request, res: Response): 
Promise<void> => {
  try {
    // 1. Extraction et typage des paramètres de requête (Query Params)
    const {  capacity,

      view_type , city , bedrooms, bathrooms , rooms,
      
      floor  ,  page  ,   limit} = req.query;

    // 2. Construction de l'objet de filtres avec
    //  conversion des types (les query params Express sont toujours des strings)
    const filters: SearchFilters = {
      capacity: capacity ? parseInt(capacity as string, 10) : undefined,
      view_type: view_type ? (view_type as string) : undefined,
      city: city ? (city as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string, 10) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms as string, 10) : undefined,
      rooms: rooms ? parseInt(rooms as string, 10) : undefined,
      floor: floor ? parseInt(floor as string, 10) : undefined,
    };

    // Valider le statut si fourni, sinon utiliser 'available' par défaut

    // Validation basique des nombres pour la pagination
    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
       res.status(400).json({ 
        success: false, 
        message: 
        "Les paramètres 'page' et 'limit' doivent être des nombres valides."  });
       return;
    }

    // 3. Appel du service
    const result = await apartmentService.searchAvailableApartments(
      filters,
      parsedPage,
      parsedLimit
    );
    
    // 4. Envoi de la réponse HTTP 200 avec les données
     res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    // 5. Gestion d'erreur globale du contrôleur
    console.error('Erreur dans ApartmentController - getApartments:', error);
     res.status(500).json({
      success: false,
      message: error.message || 'Une erreur interne du serveur est survenue.'
   
    });}};
// =================================
// POST /apartments
// Create apartment
// =================================
  export const create = async (
  req: Request,
  res: Response
  ) => {
  try {
    const apartment =
      await apartmentService.create(   req.body ) ;

    return res.status(201).json({
      success:true,
      message:
      "Apartment created successfully",
      data: apartment
});

  } catch(error:any){

    return res.status(400).json({
      success:false,
      message:error.message

    });
  }

};
// =================================
// PUT /apartments/:id
// Update apartment
// =================================
export const update = async (
  req: Request<{ id: string }>,
  res: Response ) => { try {
    const apartment =

      await apartmentService.update(
        req.params.id,
        req.body );
    return res.status(200).json({
      success:true,
      message:
      "Apartment updated successfully",
      data: apartment

    });


  } catch(error:any){


    return res.status(400).json({
      success:false,
      message:error.message
    });
 }};
// =================================
// DELETE /apartments/:id
// Delete apartment
// =================================
export const deleteApartment = async (
  req : Request<{ id: string }>,
  res: Response 
) => {
  try {
    const result =
      await apartmentService.deleteApartment(
        req.params.id
      );
    return res.status(200).json({
      success:true,
      data:result
    });
  } catch(error:any){
    return res.status(404).json({
      success:false,
      message:error.message

    });
  }
};

// =================================
// POST /apartments/:id/photos
// Add photo
// =================================
export const addPhoto = async (
  req: Request <{ id: string }>,
  res: Response
) => {
  try {
    const photo =
      await apartmentService.addPhoto( req.params.id, req.file!);
    return res.status(201).json({
      success:true,
      message:
      "Photo uploaded successfully",
      data:photo
    });
  } catch(error:any){
    return res.status(400).json({
      success:false,
      message:error.message
    });}};

// =================================
// GET /apartments/:id/photos
// Get photos
// =================================
export const getPhotos = async (
req :Request <{ id: string }>,
  res:Response
)=>{
  try{
    const photos =  await apartmentService.getPhotos( req.params.id);
    return res.status(200).json({
      success:true,
      data:photos

    });
  }catch(error:any){
    return res.status(400).json({
      success:false,
      message:error.message

    });
 }};

// =================================
// DELETE /apartments/photos/:photoId
// Delete photo
// =================================
export const deletePhoto = async (
  req:Request <{ photoId: string }>,
  res:Response
)=>{
  try{
    const result =
      await apartmentService.deletePhoto( req.params.photoId);


    return res.status(200).json({
      success:true,
      data:result
    });

  }catch(error:any){
    return res.status(400).json({
      success:false,
      message:error.message
    });
  }

};

// =================================
// PUT /apartments/:id/photos/:photoId/primary
// Set primary photo
// =================================
export const setPrimaryPhoto = async (
  req:Request <{id: string,photoId : string }>,
  res:Response
)=>{
  try{
    const photo =
      await apartmentService.setPrimaryPhoto(

        req.params.id,

        req.params.photoId

      );
    return res.status(200).json({

      success:true,

      data:photo

    });



  }catch(error:any){
    return res.status(400).json({
      success:false,
      message:error.message

    });


  }

};
// ==========================
export const addEquipment = async (  req: Request<{id: string}>,res: Response) => {
try {
    const equipment =
      await apartmentService.addEquipment(
        req.params.id,
        req.body.equipment
      );

    return res.status(201).json({
      success: true,
      data: equipment
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================
export const getEquipments = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {

    const equipments =
      await apartmentService.getEquipments(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: equipments
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

//delete equipment
// ==========================
export const deleteEquipment = async (
  req: Request<{equipmentId: string}>,
  res: Response
) => {

  try {   
    const result =await apartmentService.deleteEquipment(req.params.equipmentId );
    return 
    res.status(200).json({
      success: true,  data: result   });

  } catch (error: any) {
    return res.status(400).json({
      success: false,  message: error.message});
  }};