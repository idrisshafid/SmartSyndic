import { getSyndicById } from "../models/dashboard.models";
import * as reservationModel from "../models/reservation.models";
import { Reservation , ReservationStatus } from "../types/reservation.types";
import{  sendReservationConfirmation } from"./email.services";
import * as notificationService
from "./notifications.services";

// Get All Reservations By Syndic
  export const getAllReservations = async(syndic_id:string ,   filters?: 
    {
      status?: ReservationStatus;
      apartment_id?: string;
      date?: string;                    }
  ): Promise<Reservation[]> =>{
   return await reservationModel.getAll(syndic_id , filters); 

  }

   export const getReservation = async(id:string 
  ): Promise<Reservation> =>{

   const reservation = await reservationModel.getById(id); 
    if (!reservation) {
      
    throw new Error("Reservation not found");}
    return reservation;  }


// ======================================
// Get Calendar
// ======================================

export const getCalendar = async (apartmentId: string) => {
  const syndicId = await reservationModel.getSyndicbyapartmentid(apartmentId);
  if (!syndicId) {
    throw new Error("No syndic found for this apartment");
  }
  return await reservationModel.getAvailableDays(syndicId);
};

// ======================================
// Get Available Slots
// ======================================
export const getSlots = async (
  apartmentId: string,    date: string  ) => {

     const syndicId = await reservationModel.getSyndicbyapartmentid(apartmentId);
  if (!syndicId) {
    throw new Error("No syndic found for this apartment");
  }

   return await reservationModel.getSlotsByDay(syndicId,date);
};


// ======================================
// Create Reservation
// ======================================
export const createReservation = async ( data: Reservation) => {

  const syndicId = await reservationModel.getSyndicbyapartmentid(data.apartment_id);
  if (!syndicId) {
  throw new Error("No syndic found for this apartment");
}
  const reservationData = {...data, syndic_id: syndicId,};

  try {
    // 1 - Create reservation
    const reservation = await reservationModel.create( reservationData);

    // 2 -after WE Send confirmation email
    await sendReservationConfirmation(
        reservation.visitor_email, 
   {
    visitor_name: reservation.visitor_name,
    appointment_date: reservation.appointment_date,
    time_slot: reservation.time_slot,
    apartment_name: reservation.apartment_id 
  }); 

  await notificationService.notifyUser( 
     syndicId,
    "Nouvelle réservation ",
   ` Une nouvelle visite a été réservée par ${reservation.visitor_name}  
    Le ${reservation.appointment_date}  à l'heure ${reservation.time_slot} `,
    "reservation",
    reservation.id,
    "reservation"          );   

    return reservation;
    
  } catch (error: any) {
  
    // duplicate slot

    if (error.code === "23505") {

      throw new Error(
        "This time slot is already reserved");}
    throw error;  
}};


export const deleteReservation = async (
  id: string
) => {

  const reservation = await reservationModel.deleteReservation(id);

  if (!reservation) {
    throw new Error("Reservation not found");}

  return reservation;
};