import { Router } from "express";

import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  changeStatus,
  addComment,
  getComments,
  getHistory,
  addPhoto,
  getPhotos,
  updatePhoto,
  deletePhoto ,updateIncident , deleteIncident
} from "../controllers/incident.controller";

import { verifyToken} from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

import {addCommentSchema  , updateIncidentStatusSchema ,createIncidentSchema 
} from "../validators/incident.schema"
import { validate } from "../middleware/validate.middleware";

const router = Router();


router.put(
  "/:id",
  verifyToken,
  authorize("owner"),
  validate(createIncidentSchema), // uses the same schema (title, description, type, priority)
updateIncident);

// ======================================
// INCIDENT CRUD
// ======================================

// GET ALL INCIDENTS
// syndic/admin can see all
router.get(
  "/",
  verifyToken,
  authorize("admin","owner", "syndic"),
  getAllIncidents
);

// CREATE INCIDENT
// owner + syndic
router.post(
  "/",
 verifyToken,
  authorize("owner", "syndic"),
 validate(createIncidentSchema),
  createIncident
);

// GET INCIDENT BY ID
// owner + syndic
router.get(
  "/:id",
 verifyToken,
  authorize("owner", "syndic","admin"),
  getIncidentById
);

router.delete(
  "/:id",
  verifyToken,
  authorize("syndic", "admin"),deleteIncident);

// ======================================
// STATUS
// ======================================

// CHANGE STATUS
// only syndic
router.patch(
  "/:id/status",
 verifyToken,
  authorize("syndic"),
  validate(updateIncidentStatusSchema),
  changeStatus
);


// ======================================
// COMMENTS
// ======================================

// ADD COMMENT
// owner + syndic
router.post(
  "/:id/comments",
  verifyToken,
  authorize("owner", "syndic"),
  validate(addCommentSchema),
  addComment
);


// GET COMMENTS
router.get(
  "/:id/comments",
 verifyToken,
  authorize("owner", "syndic"),
  getComments
);

// ======================================
// HISTORY
// ======================================

// GET INCIDENT HISTORY
// syndic only
router.get(
  "/:id/history",
  verifyToken,
  authorize("syndic"),
  getHistory                   );

// ======================================
// PHOTOS
// ======================================


// UPLOAD PHOTO
router.post(
  "/:id/photos",
 verifyToken,
  authorize("owner"),
  upload.single("photos"),
  addPhoto
);


// GET PHOTOS
router.get(
  "/:id/photos",
 verifyToken,
  authorize("owner", "syndic"),
  getPhotos
);


// UPDATE PHOTO
router.put(
  "/photos/:photoId",
 verifyToken,
  authorize("owner", "syndic"),
  upload.single("photo"),
  updatePhoto
);


// DELETE PHOTO
router.delete(
  "/photos/:photoId",
verifyToken,
  authorize("owner", "syndic"),
  deletePhoto
);



export default router;