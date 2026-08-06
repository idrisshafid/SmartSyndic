import { Request, Response } from "express";
import * as incidentService from "../services/incident.service";
import { file } from "zod";



// ─── PUT /incidents/:id ──────────────────────────────────────────────────
export const updateIncident = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const incident = await incidentService.updateIncident(
      req.params.id,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Incident updated successfully",
      data: incident,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Create Incident
// POST /incidents
// ======================================
export const createIncident = async (
  req: Request,
  res: Response
) => {
  try {
      const incident = await incidentService.createIncident({
     ...req.body,
    declared_by: req.user!.id,});


    return res.status(201).json({
      success: true,
      message: "Incident created successfully",
      data: incident});


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Get All Incidents
// GET /incidents
// ======================================
export const getAllIncidents = async (
  req: Request,
  res: Response
) => {

  try {
     const user =  req.user;
        const incidents =
         await incidentService.getAll(
          user as any , req.query as any ,
       );


    return res.status(200).json({
      success: true,
      data: incidents
    });


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Get Incident By ID
// GET /incidents/:id
// ======================================
export const getIncidentById = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {

    const incident =
      await incidentService.getById(
        req.params.id , req.user!  );


    return res.status(200).json({
      success: true,
      data: incident
    });


  } catch (error: any) {


    return res.status(404).json({
      success: false,
      message: error.message
    });

  }
};
// ─── DELETE /incidents/:id ──────────────────────────────────────────────
export const deleteIncident = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const deleted = await incidentService.deleteIncident(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Incident deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Change Incident Status
// PATCH /incidents/:id/status
// ======================================
export const changeStatus = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {
    const {status} = req.body;

    const userId =  req.user?.id;


    const incident =
      await incidentService.changeStatus(req.params.id,status,userId as string);


    return res.status(200).json({
      success: true,
      message: "Incident status updated",
      data: incident
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================
// Get Incident History
// GET /incidents/:id/history
// ======================================
export const getHistory = async (
  req: Request<{id:string}> ,
  res: Response
) => {

  try {

    const history =
      await incidentService.getHistory( req.params.id);

    return res.status(200).json({
      success: true,
      data: history
    });


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// ======================================
// Add Comment
// POST /incidents/:id/comments
// ======================================
export const addComment = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {
    const {comment} = req.body;

    const author_id =req.user?.id;

    const result =await incidentService.addComment(
        req.params.id,
        author_id as string,
        comment
      );

    return res.status(201).json({
      success: true,
      message: "Comment added",
      data: result
    });  
} catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// ======================================
// Get Comments
// GET /incidents/:id/comments
// ======================================
export const getComments = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {

    const comments =
      await incidentService.getComments(
        req.params.id
      );


    return res.status(200).json({
      success: true,
      data: comments
    });


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// ======================================
// Add Photo
// POST /incidents/:id/photos
// ======================================
export const addPhoto = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {


    const photo =await incidentService.addPhoto(
        req.params.id, req.file!);
    return res.status(201).json({
      success: true,
      message: "Photo uploaded",
      data: photo
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
       stack: error.stack,
    });

  }
};

// ======================================
// Get Photos
// GET /incidents/:id/photos
// ======================================
export const getPhotos = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {

    const photos =
      await incidentService.getPhotos(
        req.params.id);

    return res.status(200).json({
      success: true,
      data: photos
    });


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Update Photo
// PUT /incidents/photos/:photoId
// ======================================
export const updatePhoto = async (
  req: Request<{photoId:string}>,
  res: Response
) => {

  try { 


    const photo =
      await incidentService.updatePhoto( req.params.photoId , req.file!);

    return res.status(200).json({
      success: true,
      message: "Photo updated",
      data: photo
    });


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    }); }};

// ======================================
// Delete Photo
// DELETE /incidents/photos/:photoId
// ======================================
export const deletePhoto = async (
  req: Request<{photoId:string}>,
  res: Response
) => {
  try {
    const photo =
      await incidentService.deletePhoto(
        req.params.photoId);


    return res.status(200).json({
      success: true,
      message: "Photo deleted",
      data: photo
    });


  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};
