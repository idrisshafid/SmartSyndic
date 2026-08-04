import { Router } from "express";
import  { register , login, forgotPassword, resetPassword, me , logout  , getuserbyid}
   from  "../controllers/auth.controller";
   import {validate} from"../middleware/validate.middleware";
   import { verifyToken } from "../middleware/auth.middleware";

   
   import {registerSchema , loginSchema} from "../validators/auth.validators";
   import { authLimiter } from "../middleware/rateLimit.middleware";
   
const router = Router();

// Register
router.post("/register" , authLimiter , validate(registerSchema),register);
// Login
router.post("/login", validate(loginSchema), login);
// Forgot Password
router.post("/forgot-password", forgotPassword);
// Reset Password
router.post("/reset-password/", resetPassword);
//me
router.get("/me",verifyToken , me);
//logout
router.post("/logout",verifyToken, logout);
router.get("/:id",verifyToken ,getuserbyid);

export default router;