import { GoogleGenerativeAI } from "@google/generative-ai";

import * as chatbotModel from "../models/chatbot.models";

import {
    SearchFilters  , ChatbotExtraction,   ApartmentResult
} from "../types/chatbot.types";

import { pool } from "../database/db";

// ======================================
// Gemini Configuration
// ======================================

const genAI =     new GoogleGenerativeAI  ( process.env.GEMINI_API_KEY!);

 const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

// ======================================
// Extract Filters From User Message
// ======================================

export const extractFilters = async (
    message:string
):Promise<ChatbotExtraction> => {

const prompt = `

You are an apartment search assistant.

Analyze this French user request.

Return ONLY valid JSON.

Create 4 search strategies.

The first one must be exact.

The others must relax conditions.

Format:

{
 "queries":[
 {
  "priority":1,
  "name":"exact",
  "filters":{
    "city":"",
    "capacity":null,
    "bedrooms":null,
    "bathrooms":null,
    "view_type":"",
    "equipments":[],
    "services":[]
  }
 }
  ]
}

Rules:

- If information is unknown use null or empty array.
- Never invent values.
- Return JSON only.

User message:      ${message}    `;


const result =   await model.generateContent( prompt);

const text =    result.response.text();

try {

    const json =   JSON.parse(text);

    return json;                  

}   catch(error) {

    throw new Error(  "Aucun appartment found"  ) ;  }
};

// ======================================
// Search With AI + Fallback
// ======================================

export const searchApartment = async (
  message: string
): Promise<ApartmentResult[]> => {

  const extraction = await extractFilters(message);

  for (const strategy of extraction.queries) {

    const apartments = await chatbotModel.searchWithFilters(strategy.filters);

    if (apartments.length > 0) {
      // Attach photos to each apartment
      const apartmentsWithPhotos = await Promise.all(

        apartments.map(async (apartment) => {

        const photo_url = await chatbotModel.getPhotos(apartment.id);

          return { ...apartment, photo_url };
        })
      );

      await saveHistory(
        message,
        strategy.filters,
        apartmentsWithPhotos.length
      );

      return apartmentsWithPhotos;
    }
  }

  // Nothing found
  await saveHistory(message, {}, 0);

  return [];
};


// ======================================
// Save Search History
// ======================================

export const saveHistory = async (
    query:string,
    filters:SearchFilters,
    results_count:number
)=>{

    await pool.query(`

INSERT INTO search_history

(query,filters_detected , results_count)

VALUES($1,$2,$3)  `

,[query , JSON.stringify(filters) , results_count]);

};