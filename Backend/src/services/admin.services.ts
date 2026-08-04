import * as adminModel from "../models/admin.model";
import { User } from "../types/user.types";
import bcrypt from "bcryptjs";


// ======================================
// Get All Syndics
// ======================================
export const getAllSyndics = async (
  pagination?: {
    page?: number;
    limit?: number;}      ): Promise<User[]> => {

  return await adminModel.getAllSyndics(
    pagination
  
);};



// ======================================
// Create Syndic
// ======================================
export const createSyndic = async (
  data: User
): Promise<User> => {


  // Check email already exists
  const existing =
    await adminModel.getUserByEmail( data.email);

  if (existing) {
    throw new Error("Email already exists");}

  // Hash password
  const hashedPassword =
    await bcrypt.hash(    data.password,      10);

  const syndic =
    await adminModel.createSyndic({
      ...data,
      password: hashedPassword     });

  return syndic;   };

// ======================================
// Toggle Syndic Status
// ======================================
export const toggleStatus = async (

  id: string,

  is_active: boolean      ): Promise<User> => {

  const syndic =
    await adminModel.toggleStatus(id,is_active);

  if (!syndic) {
    throw new Error("Syndic not found");      }
  
    return syndic;};