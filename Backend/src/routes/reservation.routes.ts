import { Router } from "express";

import {getCalendar,  getSlots, createReservation,getReservations, updateStatus ,getById,deleteReservation
} from "../controllers/reservation.controller";
import {verifyToken} from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {createReservationSchema} from "../validators/reservation.schema"

const router = Router();

// ======================================
// PUBLIC ROUTES
// NO AUTH
// ======================================
router.delete("/:id", verifyToken,authorize("syndic"),deleteReservation);
// Calendar
router.get("/calendar/:apartmentId",getCalendar);

// Available slots
router.get( "/slots/:apartmentId",getSlots);

// Create reservation
router.post( "/", validate(createReservationSchema),createReservation);


// ======================================
// SYNDIC ROUTES
// AUTH REQUIRED
// ======================================

// Get all reservations of syndic
router.get(
 "/", verifyToken,authorize("syndic"),getReservations);

// Update reservation status
router.patch("/:id",
 verifyToken, authorize("syndic"), updateStatus );

// Get single reservation by ID
router.get("/:id", verifyToken, authorize("syndic"), getById);

export default router;
