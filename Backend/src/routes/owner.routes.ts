import { Router } from "express";
import * as ownerController from "../controllers/owner.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
const router = Router();

// ===============================
// GET /owners
// ===============================
router.get("/",verifyToken,authorize("admin", "syndic"),
  ownerController.getAll);
// ===============================
// POST /owners
// ===============================
router.post( "/",verifyToken,authorize("admin", "syndic"),
 ownerController.create );
// ===============================
// GET /owners/:id
// ===============================
router.get ( "/:id",verifyToken,authorize("admin", "syndic"),
  ownerController.getById 
);
// ===============================
// assign Apartment
// POST /owners/:id/apartments/:aptId
// ===============================
router.post(
  "/:id/apartment/:aptId",verifyToken, authorize("admin","syndic"),
  ownerController.assignApartment   );

//=====================
//Get appartmets of owner
//======================
router.get(
  "/assign/:id",verifyToken, authorize("admin","syndic"),
  ownerController.getApartments
);
// ===============================
// Unassign Apartment : Remove owner from apartment As resident
// DELETE /owners/:id/apartments/:aptId
// ===============================
// DELETE /owners/:id/apartments/:aptId – unassign an apartment
router.delete("/:id/apartments/:aptId", ownerController.unassignApartment);
export default router;