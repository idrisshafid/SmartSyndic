import {pool} from "../database/db";

export const getSyndicDashboard = async(
    syndic_id:string)=> {
 const result=await pool.query(`
 SELECT * FROM v_dashboard_syndic
  WHERE syndic_id=$1  
    `,[syndic_id]
 )
 return result.rows[0];
}

export const getAdminDashboard = async()=> {
 const result=await pool.query(`

 SELECT * FROM v_dashboard_admin    `)
 return result.rows[0];
}

export const getSyndicById = async(id:string)=> {
 const result=
 await pool.query(` SELECT * FROM users where id=$1  ` , [id])
 return result.rows[0]; }