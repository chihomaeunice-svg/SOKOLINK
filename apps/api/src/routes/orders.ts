import { Router, Request, Response } from "express";

const router = Router();

// POST /api/orders/:id/confirm-delivery
// Customer confirms they received the order — triggers escrow release
router.post("/:id/confirm-delivery", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Update order status to "delivered" in Firestore
    // 2. Set escrowReleaseAt = now + 48 hours
    // 3. Schedule seller payout via Firebase Functions or a cron job

    console.log(`Delivery confirmed for order ${id}. Escrow release scheduled.`);

    res.json({
      success: true,
      message: "Asante! Pesa ya muuzaji itatolewa baada ya masaa 48.",
    });
  } catch (err) {
    res.status(500).json({ error: "Imeshindwa kuthibitisha delivery" });
  }
});

// POST /api/orders/:id/release-escrow
// Internal — called by Firebase Function or cron after 48hrs
router.post("/:id/release-escrow", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Get order from Firestore
    // 2. Calculate seller payout = order.subtotal * (1 - PLATFORM_FEE)
    // 3. Initiate M-Pesa B2C payout to seller's M-Pesa number
    // 4. Update order escrow status

    console.log(`Escrow released for order ${id}`);
    res.json({ success: true, message: "Muuzaji anapata malipo yake." });
  } catch (err) {
    res.status(500).json({ error: "Imeshindwa kutoa escrow" });
  }
});

export default router;
