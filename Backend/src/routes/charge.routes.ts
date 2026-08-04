import { Router } from "express";
import * as chargeController from "../controllers/charge.controller";
import { verifyToken } from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware"
  import {validate} from"../middleware/validate.middleware";
   
   import { createChargeSchema } from "../validators/charge.schema";
const router = Router();

// Create a charge
router.post("/",verifyToken,authorize ("syndic") ,
validate(createChargeSchema),chargeController.create);

// Get charge by id
router.get(
  "/:id",
  verifyToken,
  authorize("syndic" , "admin"),
  chargeController.getById
);

// Get all charges of one owner
router.get(
  "/owner/:ownerId",
  verifyToken,
    authorize("syndic" , "owner"),
  chargeController.getForOwner
);

// Get all charges of one syndic
router.get(
  "/syndic/:syndicId",
  verifyToken,
    authorize("syndic" , "admin"),
  chargeController.getForSyndic
);

// Validate charge
router.patch(
  "/:id/validate",
  verifyToken,
    authorize("syndic"),
  chargeController.validate
);

// Mark overdue charges
router.patch(
  "/mark-overdue",
  verifyToken,
    authorize("syndic" , "admin"),
  chargeController.markOverdue
);

router.delete("/:id" , verifyToken,
    authorize("syndic" , "admin"),  chargeController.deleteCharge)

export default router;