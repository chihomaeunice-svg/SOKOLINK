import { Router, Request, Response } from "express";
import { z } from "zod";
import { stkPush, parseMpesaCallback } from "../services/mpesa";

const router = Router();

const stkSchema = z.object({
  phoneNumber: z.string().regex(/^\+255[67]\d{8}$/, "Invalid Tanzania phone number"),
  amount: z.number().int().positive().max(10000000),
  orderId: z.string().min(1),
  description: z.string().max(50).default("Soko Link Order"),
});

// POST /api/payments/mpesa/stk-push
// Initiates M-Pesa STK Push — customer receives payment prompt on phone
router.post("/mpesa/stk-push", async (req: Request, res: Response) => {
  const parsed = stkSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }

  try {
    const result = await stkPush(parsed.data);

    if (result.responseCode !== "0") {
      return res.status(400).json({ error: "M-Pesa STK Push failed", details: result });
    }

    res.json({
      success: true,
      message: "Ombi limetumwa. Angalia simu yako kwa ujumbe wa M-Pesa.",
      checkoutRequestId: result.checkoutRequestId,
      merchantRequestId: result.merchantRequestId,
    });
  } catch (err) {
    console.error("STK Push error:", err);
    res.status(500).json({ error: "Imeshindwa kuwasiliana na M-Pesa. Jaribu tena." });
  }
});

// POST /api/payments/mpesa/callback
// M-Pesa sends payment result here after customer completes/cancels
router.post("/mpesa/callback", async (req: Request, res: Response) => {
  try {
    const result = parseMpesaCallback(req.body);
    console.log("M-Pesa callback received:", result);

    if (result.success) {
      // TODO: Update order payment status in Firestore
      // await updateDocument("payments", result.checkoutRequestId, {
      //   status: "completed",
      //   mpesaReceiptNumber: result.mpesaReceiptNumber,
      //   amount: result.amount,
      // });
      // await updateOrderStatus(orderId, "confirmed");
      // await sendSellerOrderAlert({ ... });
      console.log("✅ Payment successful:", result.mpesaReceiptNumber);
    } else {
      console.log("❌ Payment failed:", result.resultDesc);
      // TODO: Update payment as failed, notify customer
    }

    // M-Pesa requires this exact response
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" }); // Always respond 200 to M-Pesa
  }
});

// POST /api/payments/airtel/initiate
// Airtel Money payment (Tanzania)
router.post("/airtel/initiate", async (req: Request, res: Response) => {
  // TODO: Implement Airtel Money API
  // Airtel Money uses a different flow — you push to their API
  // Documentation: https://developers.airtel.africa/
  res.status(501).json({ error: "Airtel Money integration coming soon" });
});

export default router;
