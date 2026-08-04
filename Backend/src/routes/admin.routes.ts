import { Router } from "express";

import { getAllSyndics,   createSyndic,  toggleStatus
} from "../controllers/admin.controller";

import { verifyToken } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// ======================================
// GET all syndics

router.get( "/syndics",  verifyToken,
    
    authorize("admin"), getAllSyndics    );

// ======================================
// Create syndic account

router.post("/syndics", verifyToken,

    authorize("admin"), createSyndic     );

// ======================================
// Activate / deactivate syndic

router.patch( "/syndics/:id", verifyToken,
    
    authorize("admin"), toggleStatus        );

export default router;