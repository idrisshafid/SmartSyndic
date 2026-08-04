import { Router } from "express";

import { searchApartment} from "../controllers/chatbot.controller";
import { chatbotLimiter } from "../middleware/rateLimit.middleware";


const router = Router();

// ======================================
// Public Chatbot Search
// POST /chatbot/search
// ======================================

router.post(  "/search",  chatbotLimiter , searchApartment  );

export default router;