import * as notificationModel from "../models/notifications.models";
import * as ownerModel from "../models/owner.models";
import { NotificationType , Notification } from "../types/notification.types";

// ======================================
//Get all users
// ======================================
export const getAll =async(
    id:string): Promise<Notification[]>  =>{
return await notificationModel.getAll(id);
    }
// ======================================
//Get all users
// ======================================
export const getUnreadCount =async(
    id:string): Promise<number> =>{
return await notificationModel.getUnreadCount(id);
    }

// =================================
//Get Mark One Notification As Read
// ======================================
export const markRead =async(
    id:string , user_id : string)=>{

const notification =
        await notificationModel.markRead(
            
            id,user_id);

    if(!notification){
        throw new Error("Notification not found");}

    return notification;
};

// ======================================
//Get Mark One Notification As Read
// ======================================
export const markAllRead =async(
    id:string ) : Promise<void> =>{

return await notificationModel.markAllRead(id ); }


// ======================================
// Notify One User
// ======================================
export const notifyUser = async (
  user_id: string ,
  title: string,
  message: string,
  type: NotificationType,
  reference_id?: string,
  reference_type?: string
):Promise<Notification> => {

  return await notificationModel.create({
    user_id,
    title,
    message,
    type,
    reference_id,
    reference_type                      });
};

// ======================================
// Notify All Owners Of Residence
// ======================================
export const notifyAllOwners = async (
  residence_id: string,
  title: string,
  message: string,
  type: NotificationType,
  reference_id?: string,
  reference_type?: string
) => {

  const owners =
    await ownerModel.getOwnersByResidence( residence_id);

  for (const owner of owners) {

    await notifyUser(
      owner.id,
      title,
      message,
      type,
      reference_id,
      reference_type
    );}};

    export const deleteNotification = async (
  id: string,
  user_id: string
) => {

  const notification =
    await notificationModel.deleteOne(
      id,
      user_id
    );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const deleteAllNotifications = async (
  user_id: string
) => {

  return await notificationModel.deleteAll(user_id);

};