import { Request, Response } from "express";
import * as announcementService from "../services/announcement.service";

// ======================================
// Get All Announcements
// GET /announcements/:residenceId
// ======================================
export const getAllAnnouncements = async (
  req: Request<{residenceId:string}>,
  res: Response
) => {
  try {

    const announcements =
      await announcementService.getAnnouncements(
        req.params.residenceId,
        req.query as any
      );

    return res.status(200).json({
      success: true,
      data: announcements,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get Announcement By ID
// GET /announcements/details/:id
// ======================================
export const getAnnouncementById = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {

    const announcement =
      await announcementService.getAnnouncementById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: announcement,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Create Announcement
// POST /announcements
// ======================================
export const createAnnouncement = async (
  req: Request,
  res: Response
) => {
  try {

    const announcement =
      await announcementService.createAnnouncement(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Update Announcement
// PUT /announcements/:id
// ======================================
export const updateAnnouncement = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {

    const announcement =
      await announcementService.updateAnnouncement(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Delete Announcement
// DELETE /announcements/:id
// ======================================
export const deleteAnnouncement = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {

    const announcement =
      await announcementService.deleteAnnouncement(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: announcement,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Toggle Pin
// PATCH /announcements/:id/pin
// ======================================
export const togglePin = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {

    const announcement =
      await announcementService.togglePin(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Pin updated successfully",
      data: announcement,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

export const getOwnerResidence = async (
  req: Request<{ ownerId: string }>,
  res: Response
) => {
  try {
    const residence = await announcementService.getOwnerResidence(
      req.params.ownerId
    );

    return res.status(200).json({
      success: true,
      data: residence,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};