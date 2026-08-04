import { Request, Response } from "express";
import * as notificationService from "../services/notifications.services";

//=============================================
//notify user
//===========================================
export const notifyUser = async(
    req: Request<{id:string}>,
    res:Response
)=>{

 try {
 const notification = await 
 notificationService.notifyUser(req.params.id
    ,req.body.title ,
     req.body.message 
    , req.body.type,
    req.body.reference_id ,
     req.body.reference_type )
     return res.status(201).json({
       success : true,
       data: notification,
       message: "Envoi du notification avec success" 
     })

 }catch(error:any) {
    return res.status(400).json({
        success: false,
        message: error.message
    }) }
 }
//==========================================
// Notify all owners of residence
//=========================================

export const notifyAllOwners = async(
    req: Request<{residence_id:string}>,
    res:Response
)=>{

 try {
 const notification = await 
 notificationService.notifyAllOwners(req.params.residence_id
    ,req.body.title ,
     req.body.message 
    , req.body.type,
    req.body.reference_id ,
     req.body.reference_type )
     return res.status(201).json({
       success : true,
       data: notification,
       message: "Envoi du notification avec success" 
     })

 }catch(error:any) {
    return res.status(400).json({
        success: false,
        message: error.message
    }) }
 }




// ======================================
// Get All Notifications
// GET /notifications
// ======================================
export const getNotifications = async (
  req: Request,
  res: Response
) => {

  try {
        const notifications =
      await notificationService.getAll(
        req.user!.id
      );

    return res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ======================================
// Get Unread Count
// GET /notifications/unread-count
// ======================================
export const getUnreadCount = async (
  req: Request,
  res: Response
) => {

  try {

    const count =
      await notificationService.getUnreadCount(
        req.user!.id
      );

    return res.status(200).json({
      success: true,
      unread: count
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }};

// ======================================
// Mark One Notification As Read
// PATCH /notifications/:id/read
// ======================================
export const markRead = async (
  req: Request<{id: string}>,
  res: Response
) => {

  try {

    const notification =
      await notificationService.markRead(
        req.params.id,
        req.user!.id
      );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

// ======================================
// Mark All Notifications As Read
// PATCH /notifications/read-all
// ======================================
export const markAllRead = async (
  req: Request,
  res: Response
) => {

  try {

    await notificationService.markAllRead(
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const deleteNotification = async (
  req: Request<{id:string}>,
  res: Response
) => {

  try {

    const result =
      await notificationService.deleteNotification(
        req.params.id,
        req.user!.id
      );

    res.status(200).json({
      success:true,
      data:result
    });

  } catch(error:any){

    res.status(404).json({
      success:false,
      message:error.message
    });
  }
};


export const deleteAllNotifications = async (
 req:Request,
 res:Response
)=>{

 try{

  await notificationService.deleteAllNotifications(
    req.user!.id
  );


  res.status(200).json({
    success:true,
    message:"All notifications deleted"
  });


 }catch(error:any){

  res.status(500).json({
    success:false,
    message:error.message
  });

 }

};