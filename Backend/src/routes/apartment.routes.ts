import { Router } from "express";
import * as apartmentController from "../controllers/apartment.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {upload} from "../middleware/upload.middleware";
const router = Router();
// =================================
// PUBLIC ROUTES
// =================================
router.get(
  "/",apartmentController.getAllApartment);
//////////////////////////////////////////////
router.get(
  "/residence/:residenceId/",apartmentController.getApartmentsByResidence);

// Recherche appartements disponibles
// Exemple:
// GET /apartments/search?city=Agadir&capacity=4

router.get(
  "/search" , apartmentController.searchAvailableApartments);

// Voir un appartement
// GET /apartments/:id

router.get( "/:id", apartmentController.getById);

// Create apartment
// POST /apartments

router.post( "/", verifyToken,  authorize("syndic"), apartmentController.create
);
// Update apartment
// PUT /apartments/:id

router.put("/:id", verifyToken,authorize("syndic"),
  apartmentController.update
);

// Delete apartment
// DELETE /apartments/:id

router.delete("/:id",verifyToken,authorize("syndic"),
  apartmentController.deleteApartment);

// =================================
// PHOTOS
// =================================
/* Upload photo
POST /apartments/:id/photos
 Body: { form-data key = image value = file }     */

router.post( "/:id/photos", verifyToken, authorize("syndic"),
 
upload.single("photo"), apartmentController.addPhoto);

// Get photos
// GET /apartments/:id/photos

router.get( "/:id/photos",  apartmentController.getPhotos);

// Delete photo
// DELETE /apartments/photos/:photoId
router.delete(
  "/photos/:photoId",
  verifyToken,
  authorize("syndic"),
  apartmentController.deletePhoto);
// Set primary photo
// PUT /apartments/:id/photos/:photoId/primary
router.put(
  "/photos/:photoId/primary",verifyToken,
  authorize("syndic"),
  apartmentController.setPrimaryPhoto
);

// ==========================
// EQUIPMENTS
// ==========================

// Ajouter un équipement
router.post(
  "/:id/equipments",
   verifyToken,
   authorize("syndic"),
   apartmentController.addEquipment
);

// Voir les équipements
router.get(
  "/:id/equipments", apartmentController.getEquipments);
  
// Supprimer un équipement
router.delete(
  "/equipments/:equipmentId", verifyToken, authorize("syndic"),
  apartmentController.deleteEquipment
);

export default router;