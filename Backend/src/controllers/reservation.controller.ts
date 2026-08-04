import { Request, Response } from "express";
import * as reservationService from "../services/reservation.services";
import * as reservationModel from "../models/reservation.models";

// ======================================
// GET Calendar
// GET /calendar/:syndicId
// PUBLIC
// ======================================
export const getCalendar = async (
  req: Request<{apartmentId:string}>,
  res: Response
) => {

  try {
         const data =  await reservationService.getCalendar
         ( req.params.apartmentId      );

    return res.status(200).json({
      success: true,
      data});


  } catch (err:any) {

    return res.status(500).json({
      success:false,
      message:err.message
    });}};

// ======================================
// GET Slots By Day
// GET /slots/:syndicId?date=
// PUBLIC
// ======================================
export const getSlots = async (
  req: Request<{apartmentId: string}>,
  res: Response
) => {
  try {
    const {date} = req.query;

    if(!date){
      return res.status(400).json({
        success:false,
        message:"Date required"
      }); }

    const data =
      await reservationService.getSlots(
        req.params.apartmentId,
        date as string  );

    return res.status(200).json({
      success:true,
      data
    });


  } catch(err:any){

    return res.status(500).json({
      success:false,
      message:err.message
    });  } };

// ======================================
// CREATE Reservation
// POST /reservations
// PUBLIC
// ======================================
export const createReservation = async (
  req: Request,
  res: Response
) => {

  try {

    const reservation =
      await reservationService.createReservation( req.body   );
    
      return res.status(201).json({
      success:true,
      message: "Reservation created",
      data:reservation

    });

  }catch(err:any){

    // UNIQUE constraint PostgreSQL
    if(err.code === "23505"){
      return res.status(409).json({
        success:false,
        message:
        "Ce créneau est déjà pris"
      }) ;}

    return res.status(500).json({
      success:false,
      message:err.message });
}};

// ======================================
// GET All Reservations
// GET /reservations
// SYNDIC
// ======================================
export const getReservations = async (
  req:Request,
  res:Response
)=>{
 try{

  const syndic_id =    req.user!.id;

  const reservations =
    await reservationService.getAllReservations(
      syndic_id,      req.query as any);


  return res.status(200).json({
    success:true,
    data:reservations

  });

 }catch(err:any){

  return res.status(500).json({
    success:false,
    message:err.message
  });
 }};


// ======================================
// Update Reservation Status
// PATCH /reservations/:id
// SYNDIC
// ======================================
export const updateStatus = async (
 req:Request<{id:string}>,
 res:Response
)=>{
 try{
  const { status  } = req.body;
  const reservation =
    await reservationModel.updateStatus( req.params.id,
      status );

  if(!reservation){
    return res.status(404).json({
      success:false,
      message: "Reservation not found"
    }); }

  return res.status(200).json({
    success:true,
    data:reservation  });

 }catch(err:any){
  return res.status(500).json({
    success:false,
    message:err.message});
}};

 // GET /reservations/:id
 // Get a single reservation by ID (syndic only)
 
export const getById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const reservation = await reservationService.getReservation(req.params.id);
    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }};

  export const deleteReservation = async (
  req: Request<{ id: string }>, res: Response) => {

  try {

    const reservation =
      await reservationService.deleteReservation(    req.params.id    );

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
      data: reservation});

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }
};