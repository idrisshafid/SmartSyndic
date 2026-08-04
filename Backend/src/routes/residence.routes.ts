import { Router } from "express";

import * as residenceController from "../controllers/residence.controller";
import * as ServiceController from "../controllers/residenceservice.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

import { validate } from "../middleware/validate.middleware";
import {   updateResidenceSchema , createResidenceSchema } 
from "../validators/residence.schema";
const router = Router();

/* ---------- Public ---------- */


// GET /residences/public
router.get( "/public", residenceController.getPublic);
// GET /residences/:id
router.get( "/:id",residenceController.getById);

/* ---------- Syndic ---------- */

// GET /residences
router.get(
  "/", verifyToken,authorize("syndic"),  residenceController.getAllForSyndic
);

// POST /residences
router.post("/", 
  verifyToken,authorize("syndic"),  validate(createResidenceSchema) ,
   residenceController.create);

// PUT /residences/:id
router.put( "/:id", verifyToken,authorize("syndic"), 
validate(updateResidenceSchema) , residenceController.update);

// DELETE /residences/:id
router.delete(
  "/:id",verifyToken,authorize("syndic"), residenceController.deleteResidence
);

/* ---------- Residence Photos ---------- */

// POST /residences/:id/photos 
router.post(
  "/:id/photos",verifyToken, authorize("syndic"),
   upload.single("photo"), residenceController.uploadPhoto
);
  //DELETE /residences/photos/:photoid
router.delete("/photos/:photoId",verifyToken,
  authorize("syndic"),residenceController.deletePhoto);
  //get /residences/photos/:photoid
router.get(  "/:id/photos",residenceController.getPhoto);


/* ---------- Residence Services ---------- */

// GET /residences/:id/services
router.get("/:id/services",verifyToken,authorize("syndic") ,ServiceController.getServices
);
// POST /residences/:id/services
router.post(
  "/:id/services",verifyToken,authorize("syndic"),ServiceController.addService);

// DELETE /residences/services/:serviceId
router.delete("/services/:serviceId",  verifyToken, authorize("syndic"),
  ServiceController.deleteService);




export default router;