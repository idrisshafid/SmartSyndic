import { Request, Response } from "express";
import * as chargeService from "../services/charge.services";

// ======================================
// Create Charge
// ======================================
export const create = async (
  req: Request,
  res: Response
) => {  try {
    const charge = await chargeService.createCharge(req.body);

    return res.status(201).json({
      success: true,
      message: "Charge created successfully",
      data: charge,});

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,});
  }
};

// ======================================
// Get Charges For Owner
// ======================================
export const getForOwner = async (
  req: Request <{ownerId: string}>,
  res: Response
) => {
  try {
    const charges = await chargeService.listForOwner(
      req.params.ownerId
    );

    return res.status(200).json({
      success: true,
      data: charges,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Charges For Syndic
// ======================================
export const getForSyndic = async (
  req: Request <{syndicId: string}>,
  res: Response
) => {
  try {
    const charges = await chargeService.listForSyndic(
      req.params.syndicId
    );

    return res.status(200).json({
      success: true,
      data: charges,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Charge By Id
// ======================================
export const getById = async (
  req: Request<{id: string}>,
  res: Response
) => {
  try {
    const charge = await chargeService.getChargeById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: charge,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Validate Charge
// ======================================
export const validate = async (
  req: Request<{id:string}>,
  res: Response
) => {
  try {
    const charge = await chargeService.validateCharge(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Charge validated",
      data: charge,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Overdue Charges
// ======================================
export const markOverdue = async (
  req: Request,
  res: Response
) => {
  try {
    const count = await chargeService.markOverdue();

    return res.status(200).json({
      success: true,
      message: `${count} charge(s) updated`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteCharge = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const result = await chargeService.deleteCharge(req.params.id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};