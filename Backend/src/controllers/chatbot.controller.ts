import { Request, Response } from "express";

import * as chatbotService from "../services/chatbot.services";

// ======================================
// Search Apartments By Chatbot
// POST /chatbot/search
// ======================================

export const searchApartment = async (

    req: Request,    res: Response    ) => {

    try {

        const {   message  } = req.body;

        // Validation simple
        if(  !message || typeof message !== "string"  ){

            return res.status(422).json({
                success:false,
                message: "Message is required"            });
}

        const apartments =  await chatbotService.searchApartment( message );

        return res.status(200).json({ 

            success:true,

            message:
            
            apartments.length > 0 ? "Apartments found": "No apartments found",

            count:apartments.length,

            data:apartments
                                                       });

    } catch(error:any){

        console.error(  "CHATBOT ERROR:",error);
        console.log("Gemini error:",error.message,error.cause);

        return res.status(500).json     ({

            success:false,

            message: error.message        });
   
        }};