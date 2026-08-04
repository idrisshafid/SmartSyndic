import * as announcementModel from "../models/announcement.models";
import { Announcement } from "../types/announcement.types";
import * as notificationService
from "./notifications.services";

// ======================================
// Get All Announcements
// ======================================
export const getAnnouncements = async (
  residence_id: string, 
  pagination?: {
    page?: number;
    limit?: number; } )
    : Promise<Announcement[]> => {

  return await announcementModel.getAll( residence_id , pagination  );};

// ======================================
// Get Announcement By Id
// ======================================
export const getAnnouncementById = async (
  id: string ): Promise<Announcement> => {

  const announcement = await announcementModel.getById(id);

  if (!announcement) {
    throw new Error("Announcement not found");
  }
  return announcement;   };

// ======================================
// Create Announcement
// ======================================
export const createAnnouncement = async (
  data: Announcement ): Promise<Announcement> => {

  const announcement = await announcementModel.create(data);

   await notificationService.notifyAllOwners(
    data.residence_id,
    data.title,
    data.content,
    "announcement",
    announcement.id,
    "announcement"        );
  
  return announcement
  };

// ======================================
// Update Announcement
// ======================================
export const updateAnnouncement = async (

    id: string, data: Partial<Announcement>  
  ): Promise<Announcement> => {

  const announcement =   await announcementModel.getById(id);

  if (!announcement) {
    throw new Error("Announcement not found");}

  const updated =  await announcementModel.update( id , data);

  if (!updated) {
    throw new Error("Failed to update announcement");
  }

  return updated;
};

// ======================================
// Delete Announcement
// ======================================
export const deleteAnnouncement = async (
  id: string
): Promise<Announcement> => {

  const announcement =
    await announcementModel.getById(id);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  const deleted =
    await announcementModel.remove(id);

  if (!deleted) {
    throw new Error("Failed to delete announcement");
  }

  return deleted;
};

// ======================================
// Toggle Pin
// ======================================
export const togglePin = async (
  id: string
): Promise<Announcement> => {

  const announcement =
    await announcementModel.getById(id);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  const updated =
    await announcementModel.togglePin(id);

  if (!updated) {
    throw new Error("Failed to pin/unpin announcement");
  }

  return updated;
};


export const getOwnerResidence = async (ownerId: string) => {
  const residence_id = await announcementModel.getResidenceIdByOwnerId(ownerId);

  if (!residence_id) {
    throw new Error("Residence not found");
  }

  return residence_id;
};