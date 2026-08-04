import { Router } from "express";

import {
  getAllAnnouncements,  getOwnerResidence,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePin,
} from "../controllers/announcement.controller";

import { verifyToken} from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// ======================================
// Public Routes
// ======================================

router.get("/:ownerId/residence",verifyToken,  getOwnerResidence);


// Get all announcements of one residence
router.get( "/residence/:residenceId", verifyToken, authorize("syndic","owner"), getAllAnnouncements);

// Get one announcement
router.get("/:id",getAnnouncementById);

// ======================================
// Syndic Routes
// ======================================

// Create announcement
router.post(
  "/",
  verifyToken,
  authorize("syndic"),
  createAnnouncement
);

// Update announcement
router.put(
  "/:id",
  verifyToken,
  authorize("syndic"),
  updateAnnouncement
);

// Delete announcement
router.delete(
  "/:id",
  verifyToken,
  authorize("syndic"),
  deleteAnnouncement
);

// Pin / Unpin announcement
router.patch(
  "/:id/pin",
  verifyToken,
  authorize("syndic"),
  togglePin
);

export default router;