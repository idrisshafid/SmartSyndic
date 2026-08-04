import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { verifyToken } from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware";

 import {validate} from"../middleware/validate.middleware";
   
   import { paymentSchema } from "../validators/charge.schema";

const router = Router();

// ==============================
// Payments
// ==============================

// Validate payment
router.post(
  "/",
  verifyToken,
  authorize("syndic"),
  validate(paymentSchema),
  paymentController.validatePayment
);

// Payment by charge
router.get(
  "/charge/:chargeId",
   verifyToken,
    authorize("syndic","admin" ),
  paymentController.getByCharge
);

// Payment history of owner
router.get(
  "/owner/:ownerId",
   verifyToken,
    authorize("owner","syndic" ),
  paymentController.historyForOwner
);

export default router;