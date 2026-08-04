import { pool } from "../database/db";
import {
           SearchFilters, ApartmentResult}
            from "../types/chatbot.types";

// ======================================
// Search Apartments With Filters
// ======================================

export const searchWithFilters = async (
    filters: SearchFilters
): Promise<ApartmentResult[]> => {

    let query = `

        SELECT *FROM v_available_apartments WHERE 1=1 `;

    const params: any[] = [];
    let index = 1;

    // ============================
    // City
    // ===============================

    if (filters.city) {

        query += ` AND city ILIKE $${index} `;

        params.push(`%${filters.city}%`);
        
        index++;                              }

    // ===============================
    // Capacity
    // ===============================

    if (filters.capacity) {

        query += ` AND capacity >= $${index} `;

        params.push( filters.capacity);

        index++;}

    // ===============================
    // Bedrooms
    // ===============================

    if (filters.bedrooms) {
        
        query += ` AND bedrooms >= $${index}  `;
        params.push(filters.bedrooms);
        index++;
    }

    // ===============================
    // Bathrooms
    // ===============================
    if (filters.bathrooms) {

        query += ` AND bathrooms >= $${index} `;

        params.push(  filters.bathrooms);

        index++; }

    // ===============================
    // Price min
    // ===============================

    if (filters.min_price) {
        query += ` AND price_per_night >= $${index}  `;
          params.push(  filters.min_price);

        index++;
}

    // ===============================
    // Price max
    // ===============================

    if (filters.max_price) {

        query += `       AND price_per_night <= $${index}   `;

        params.push(     filters.max_price);  index++;}

    // ===============================
    // View Type
    // ===============================

    if (filters.view_type) {
        query += `  AND view_type = $${index}    `;
        
        params.push(filters.view_type);

        index++; }

    // ===============================
    // Equipments
    // PostgreSQL ARRAY
    // ===============================

    if ( filters.equipments && filters.equipments.length > 0) {

        query += ` AND equipments @> $${index} `;


        params.push(filters.equipments);

        index++;}

    // ===============================
    // Services
    // ===============================

    if (
        filters.services &&
        filters.services.length > 0
    ) {
        query += `  AND services @> $${index}   `;

        params.push( filters.services);

        index++;}

    // ===============================
    // Order
    // ===============================

    query +=
     `   ORDER BY  
    
     price_per_night ASC

        LIMIT 20  `;

    const result =  await pool.query

    (  query, params);

    return result.rows;};

    export const getPhotos = async(id:string)=>{

   const result = await pool.query(`  SELECT photo_url FROM apartment_photos 
    
     WHERE  apartment_id =$1 LIMIT 1 `,[id]) ;
     
     return result.rows[0].photo_url??null;}