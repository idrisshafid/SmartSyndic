import * as incidentModel from "../models/incident.models";
import * as  notificationService from"./notifications.services";
import {
  Incident,IncidentStatus,incidentfilters,} from "../types/incident.types";
  import cloudinary from "../config/cloudinary.config";
  import * as uploadService from "./upload.services";
  import { UpdateIncidentStatusInput } from "../types/incident.types";
  import { AuthPayload} from "../types/user.types";

  
// ======================================
// Get All Incidents
// ======================================
export const getAll = async (
  user:  AuthPayload
, filtres:Incident): Promise<Incident[]> => {
  if (user.role === "owner") {
    return await incidentModel.getAllForOwner(user.id);
  }

  if (user.role === "syndic") {
    return await incidentModel.getAllForSyndic(user.id);
  }

  if (user.role === "admin") {
    return await incidentModel.getAll(filtres);
  }

  throw new Error("Unauthorized");
};
// ======================================
// Get Incident By Id
// ======================================
export const getById = async (
  incidentId: string,
  user: AuthPayload
): Promise<Incident> => {
  const incident = await incidentModel.getById(incidentId);

  if (!incident) {
    throw new Error("Incident not found");
  }

  if (user.role === "admin") {
    return incident;
  }

  if (user.role === "syndic") {
    const hasAccess = await incidentModel.belongsToSyndic(
      incident.id,
      user.id
    );

    if (!hasAccess) {
      throw new Error("Unauthorized");
    }

    return incident;
  }

  if (user.role === "owner") {

    const hasAccess = await incidentModel.belongsToOwnerResidence(
      incident.id,
      user.id);

    if (!hasAccess) {
      throw new Error("Unauthorized");
    }

    return incident;
  }

  throw new Error("Unauthorized");
};
//================================
//Update incident
//==========================
export const updateIncident = async (
  id: string,
  data:Incident
): Promise<Incident> => {
  const updated = await incidentModel.update(id, data);
  if (!updated) {
    throw new Error("Incident not found");
  }
  return updated;
};

// ======================================
// Declare Incident
// ======================================
export const createIncident = async (data: Incident): Promise<Incident> => {
  // 1. Get apartment, residence and syndic from owner
  const info = await incidentModel.getapartmentbyowner(data.declared_by);

  if (!info) {
    throw new Error("No active apartment found for this owner.");
  }

  // 2. Build complete incident
  const incidentData: Incident = {
    ...data,
    apartment_id: info.apartment_id,
    residence_id: info.residence_id,
    assigned_to: info.syndic_id,
  };

  // 3. Create incident
  return await incidentModel.create(incidentData);
};



// ======================================
// Change Incident Status
// ======================================
export const changeStatus = async (
  id: string,
  newStatus: UpdateIncidentStatusInput["status"],
  userId: string
): Promise<Incident> => {

  // 1. Vérifier que l'incident existe
  const incident = await incidentModel.getById(id);

  if (!incident) {
    throw new Error("Incident not found");
  }
  // 2. Vérifier les transitions autorisées

  const allowedTransitions: Record< IncidentStatus,IncidentStatus[]> = {

    pending: [ "in_progress"], in_progress: [ "resolved"],

    resolved: []
  };
  const canChange =
    allowedTransitions[incident.status]  .includes(newStatus);

  if (!canChange) {
    throw new Error(
      `Cannot change status from ${incident.status} to ${newStatus}`
    );
  }
  // 3. Update status
  const updatedIncident =
    await incidentModel.updateStatus( id,  newStatus );

  if (!updatedIncident) {
    throw new Error("Failed to update incident status");  }

      await notificationService.notifyUser( 
    incident.declared_by,
    "Incident mis à jour",
    `Le statut est maintenant : ${newStatus}`,
    "incident",
    incident.id,
    "incident");

  return updatedIncident;

  
};

// ======================================
// Delete Incident
// ======================================
export const deleteIncident = async (
  id: string
): Promise<Incident> => {


  const incident =
    await incidentModel.getById(id);


  if (!incident) {
    throw new Error(
      "Incident not found" );
  }
  const deleted =await incidentModel.remove(id);
  if (!deleted) {
    throw new Error(
      "Failed to delete incident"
    );
  }
  return deleted;
};

// ======================================
// Get Incident History
// ======================================
export const getHistory = async (
  incident_id: string
) => {
  const incident =
    await incidentModel.getById(incident_id);
  if (!incident) {
    throw new Error("Incident not found");
  }
  return await incidentModel.getHistory(
    incident_id
  );
};

// ======================================
// Add Comment
// ======================================
export const addComment = async (
  incident_id: string,
  author_id: string,
  comment: string
) => {

  const incident =
    await incidentModel.getById(incident_id);
  if (!incident) {
    throw new Error("Incident not found");
  }
  return await incidentModel.addComment(
    incident_id,
    author_id,
    comment
  );
};

// ======================================
// Get Comments
// ======================================
export const getComments = async (
  incident_id: string
) => {

  const incident =
    await incidentModel.getById(incident_id);

  if (!incident) {
    throw new Error("Incident not found");
  }
  return await incidentModel.getComments(
    incident_id
  );
};
// ======================================
// Add Photo
// ======================================
export const addPhoto = async (
  incident_id: string,file: Express.Multer.File 
) => {

  const incident = await incidentModel.getById(incident_id);
  if (!incident) {
    throw new Error("Incident not found"); }

       const image = await uploadService.uploadImage( file, 
          uploadService.CLOUDINARY_FOLDERS.INCIDENTS);
         
          if (!image) {
    throw new Error("photo not found"); }
    
  return await incidentModel.addPhoto(
    incident_id , image.url , image.public_id );
};



// ======================================
// Get Photos
// ======================================
export const getPhotos = async (
  incident_id: string
) => {

  const incident =
    await incidentModel.getById(incident_id);

  if (!incident) {
    throw new Error("Incident not found");
  }
  return await incidentModel.getPhotos( incident_id);
};
// ======================================
// Update Photo
// ======================================
export const updatePhoto = async (
  photo_id: string,
file: Express.Multer.File
) => {

 if(!file){
   throw new Error("Image required");
 }

 // 1. Get old photo
 const oldPhoto =await incidentModel.getPhotos(photo_id );

 if  (!oldPhoto){  throw new Error("Photo not found") ;}

 // 2. Delete old image from Cloudinary

 await cloudinary.uploader.destroy( oldPhoto.public_id );

    // 3. Upload new image

 const image = await uploadService.uploadImage
  (file,uploadService.CLOUDINARY_FOLDERS.INCIDENTS );

 // 4. Update database

 const updatedPhoto = await incidentModel.updatePhoto(
      oldPhoto.id,
      image.url,
      image.public_id
   );
 return updatedPhoto;
};

// ======================================
// Delete Photo
// ======================================
export const deletePhoto = async (
  photo_id: string
) => {
  const photo =
    await incidentModel.getPhotoById(
      photo_id);


  if (!photo) {
    throw new Error("Photo not found");
  }


  return await incidentModel.deletePhoto(
    photo_id);};