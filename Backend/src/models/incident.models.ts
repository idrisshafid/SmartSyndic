import { Incident , incidentfilters , UpdateIncidentStatusInput}
 from "../types/incident.types";
import { incident_comments  } from "../types/incident_comments.types";
import { incident_history } from "../types/incident_history.types";
import {pool} from "../database/db";


// Owner → incidents of the residence where the owner has an active apartment
export const getAllForOwner = async (
  ownerId: string
): Promise<Incident[]> => {
  const result = await pool.query(
    `
    SELECT DISTINCT i.*
    FROM incidents i
    JOIN apartments a
      ON i.apartment_id = a.id
    JOIN owner_apartments oa
      ON oa.apartment_id = a.id
    WHERE oa.owner_id = $1
      AND oa.is_active = TRUE
      AND i.residence_id = a.residence_id
    ORDER BY i.created_at DESC
    `,   [ownerId]);

  return result.rows;
};

// Syndic → incidents of all residences managed by the syndic
export const getAllForSyndic = async (
  syndicId: string
): Promise<Incident[]> => {
  const result = await pool.query(
    `
    SELECT i.*
    FROM incidents i
    JOIN residences r
      ON r.id = i.residence_id
    WHERE r.syndic_id = $1
    ORDER BY i.created_at DESC
    `,
    [syndicId]
  );

  return result.rows;
};

// ======================================
// Get All Incidents
// ======================================
export const getAll = async (
  filters: Partial<incidentfilters>
): Promise<Incident[]> => {

  let query = `
    SELECT *
    FROM incidents
    WHERE 1=1
  `;

  const values: any[] = [];
  let index = 1;

  // Residence
  if (filters.residence_id) {
    query += ` AND residence_id = $${index++}`;
    values.push(filters.residence_id);
  }

  // Apartment
  if (filters.apartment_id) {
    query += ` AND apartment_id = $${index++}`;
    values.push(filters.apartment_id);
  }

  // Declared By
  if (filters.declared_by) {
    query += ` AND declared_by = $${index++}`;
    values.push(filters.declared_by);
  }

  // Priority
  if (filters.priority) {
    query += ` AND priority = $${index++}`;
    values.push(filters.priority);
  }

  // Status
  if (filters.status) {
    query += ` AND status = $${index++}`;
    values.push(filters.status);
  }

  query += `
    ORDER BY created_at DESC  `;
  const result = await pool.query(query, values);
  return result.rows;
};

// ======================================
// Get Incident By Id
// ======================================
export const getById = async (
  id: string
): Promise<Incident> => {
  const result = await pool.query(`
    SELECT *
    FROM incidents
    WHERE id = $1
    `,
    [id]);
  return result.rows[0] || null;
};
  
// ======================================
// Create Incident
// ======================================
export const create = async (
  data: Incident
): Promise<Incident> => {

  const result = await pool.query(  `
    INSERT INTO incidents
    (  residence_id,  apartment_id,declared_by,
      assigned_to, title,  description,  type , priority)
    VALUES( $1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.residence_id,
      data.apartment_id,
      data.declared_by,
      data.assigned_to,
      data.title,
      data.description,
      data.type,
      data.priority,
    ]
  );
 return result.rows[0];};

export const getapartmentbyowner= async(ownerid: string)=>{
  const result= await pool.query(`SELECT
    oa.owner_id,
    oa.apartment_id,
    a.residence_id,
    r.syndic_id
FROM owner_apartments oa
JOIN apartments a
    ON oa.apartment_id = a.id
JOIN residences r
    ON a.residence_id = r.id
WHERE oa.owner_id = $1
  AND oa.is_active = TRUE
LIMIT 1;`,[ownerid]);
return result.rows[0]??null;
}



 
// ======================================
// Update Incident Status
// ======================================
export const updateStatus = async (
  id: string,
  status: Incident["status"]
): Promise<Incident | null> => {

  const result = await pool.query(
    `
    UPDATE incidents
    SET
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [
      status,
      id,
    ]
  );

  return result.rows[0] || null;
};

// ======================================
// Delete Incident
// ======================================
export const remove = async (
  id: string
): Promise<Incident | null> => {

  const result = await pool.query(
    `
    DELETE FROM incidents
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0] || null;
};
// ─── Update incident ──────────────────────────────────────────────────────
export const update = async (
  id: string,
  data: Incident
): Promise<Incident | null> => {
  const result = await pool.query(
    `
    UPDATE incidents
    SET
      title = $1,
      description = $2,
      type = $3,
      priority = $4,
      updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [data.title, data.description, data.type || null, data.priority, id]
  );
  return result.rows[0] || null;
};
// ======================================
// Get Incident History
// ======================================
export const getHistory = async (
  incident_id: string): Promise<incident_history[]> => {

  const result = await pool.query(`
    SELECT *
    FROM incident_history
    WHERE incident_id = $1
    ORDER BY created_at DESC`,
    [incident_id]
  );

  return result.rows;
};

// ======================================
// Add Comment
// ======================================
export const addComment = async (
  incident_id: string,
  author_id: string,
  comment: string
): Promise<incident_comments> => {

  const result = await pool.query(
    `
    INSERT INTO incident_comments
    (
      incident_id,
      author_id,
      comment)   
      VALUES($1,$2,$3) RETURNING *`,
    [
      incident_id,
      author_id,
      comment,
    ]
  );

  return result.rows[0];
};

// ======================================
// Get Comments
// ======================================
export const getComments = async (
  incident_id: string
): Promise<incident_comments[]> => {

  const result = await pool.query(
    `
    SELECT *
    FROM incident_comments
    WHERE incident_id = $1
    ORDER BY created_at ASC
    `,
    [incident_id]
  );

  return result.rows;
};

// ======================================
// Add Photo
// ======================================
export const addPhoto = async (
  incident_id: string,
  photo_url: string , public_id : string) => {

  const result = await pool.query(`
    INSERT INTO incident_photos    (   incident_id, 
      photo_url,  public_id  )
    VALUES( $1 , $2 , $3    )
    RETURNING *`,[
      incident_id,
      photo_url, public_id]
  );

  return result.rows[0];};

// ======================================
// Get Photos By Incident
// ======================================
export const getPhotos = async (
  incident_id: string
):Promise<any> => {
  const result = await pool.query(`
    SELECT *
    FROM incident_photos
    WHERE incident_id = $1
    ORDER BY created_at ASC`,
    [incident_id]);
  return result.rows;
};

// ======================================
// Update Photo
// ======================================
export const updatePhoto = async (
  photo_id: string,
  photo_url: string ,
  public_id : string
) => {
  const result = await pool.query(`
    UPDATE incident_photos
    SET photo_url = $1 AND   public_id = $2,
    WHERE id = $3
    RETURNING *
    `,
    [photo_url, 
       public_id,
      photo_id, ]   );

  return result.rows[0] || null;
};

// ======================================
// Delete Photo
// ======================================
export const deletePhoto = async (
  photo_id: string
) => {

  const result = await pool.query(
    `
    DELETE FROM incident_photos
    WHERE id = $1
    RETURNING *
    `,
    [photo_id]
  );

  return result.rows[0] || null;
};
// ======================================
// Get Photo By Id
// ======================================
export const getPhotoById = async (
  photo_id: string
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM incident_photos
    WHERE id = $1
    `,
    [photo_id]
  );

  return result.rows[0] || null;
};

export const belongsToSyndic = async (
  incidentId: string,
  syndicId: string
): Promise<boolean> => {
  const result = await pool.query(
    `
    SELECT 1
    FROM incidents i
    JOIN residences r
      ON i.residence_id = r.id
    WHERE i.id = $1
      AND r.syndic_id = $2
    LIMIT 1
    `,
    [incidentId, syndicId]
  );

  return result.rowCount! > 0;
};

export const belongsToOwnerResidence = async (
  incidentId: string,
  ownerId: string
): Promise<boolean> => {
  const result = await pool.query(
    `
    SELECT 1
    FROM incidents i
    JOIN owner_apartments oa
      ON oa.owner_id = $2
    JOIN apartments a
      ON oa.apartment_id = a.id
    WHERE i.id = $1
      AND oa.is_active = TRUE
      AND i.residence_id = a.residence_id
    LIMIT 1
    `,
    [incidentId, ownerId]
  );

  return result.rowCount! > 0;
};