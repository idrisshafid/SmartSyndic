import { Router } from "express";
import { verifyToken} from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import  {getAdminDashboard , getSyndicDashboard }
   from  "../controllers/dashboard.controller";
   
const router = Router();

// dashboard syndic
router.get("/:id",verifyToken,authorize("syndic"), getSyndicDashboard);
// dashboard admin
router.get("/admin", verifyToken , authorize("admin"),getAdminDashboard);

export default router;