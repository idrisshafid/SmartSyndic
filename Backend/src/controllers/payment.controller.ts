import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";
import * as chargeService from "../services/charge.services"

// ======================================
// Validate Payment
// ======================================
export const validatePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment = await paymentService.validatePayment({
      ...req.body,
      validated_by: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment validated successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("VALIDATE PAYMENT ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Payment By Charge
// ======================================
export const getByCharge = async (
  req: Request <{chargeId: string}>, res: Response ) => {
  try {
    const payment =
      await paymentService.getByChargeId(req.params.chargeId);

    return res.status(200).json({
      success: true,
      data: payment,
    });}
     catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    }); }};

// ======================================
// Owner Payment History
// ======================================
export const historyForOwner = async (
  req: Request <{ownerId: string}>,
  res: Response ) => {
  try {
    const history =
      await paymentService.getHistoryForOwner( req.params.ownerId);

    return res.status(200).json({
      success: true,
      data: history,
    });} 
    catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    }); }};