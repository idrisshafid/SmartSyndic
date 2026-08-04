import { Router } from "express";
import {
    notifyUser,
    notifyAllOwners,
    getNotifications,
    getUnreadCount,  deleteAllNotifications, deleteNotification,
    markRead,
    markAllRead  } 
    from "../controllers/notifications.controller";

import { verifyToken } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware"

const router = Router();

// ======================================
// User Notifications
// ======================================

router.get(
    "/",    verifyToken,  getNotifications
);


router.get(
    "/unread-count",  verifyToken,  getUnreadCount
);

router.patch(
    "/:id/read",  verifyToken, markRead
);

router.patch(
    "/read-all",   verifyToken,   markAllRead
);

// ======================================
// Admin / Syndic
// ======================================

// Notify one user
router.post(
    "/user/:id", verifyToken,  authorize("admin", "syndic"),
    notifyUser
);


// Notify all owners of residence
router.post(
    "/residence/:residence_id",  verifyToken,authorize("admin", "syndic"),
    notifyAllOwners
);

router.delete(
 "/:id",
verifyToken ,
 deleteNotification
);


router.delete(
 "/",
verifyToken ,
 deleteAllNotifications
);


export default router;