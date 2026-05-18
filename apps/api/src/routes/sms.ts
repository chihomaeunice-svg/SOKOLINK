import { Router, Request, Response } from "express";
import { z } from "zod";
import { sendOTP } from "../services/africastalking";

const router = Router();

// In-memory OTP store (use Redis in production)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

const phoneSchema = z.object({
  phone: z.string().regex(/^\+255[67]\d{8}$/, "Nambari ya simu si sahihi"),
});

// POST /api/sms/send-otp
router.post("/send-otp", async (req: Request, res: Response) => {
  const parsed = phoneSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Nambari ya simu si sahihi. Mfano: +255712345678" });
  }

  const { phone } = parsed.data;

  // Block if recent OTP already sent (5 min cooldown)
  const existing = otpStore.get(phone);
  if (existing && existing.expiresAt > Date.now() + 5 * 60 * 1000) {
    return res.status(429).json({ error: "OTP tayari imetumwa. Subiri dakika 5." });
  }

  try {
    const { code, messageId } = await sendOTP(phone);

    // Store OTP — expires in 10 minutes
    otpStore.set(phone, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });

    console.log(`OTP sent to ${phone}: ${code} (messageId: ${messageId})`);

    res.json({ success: true, message: "OTP imetumwa kwa SMS. Angalia simu yako." });
  } catch (err) {
    console.error("SMS error:", err);
    res.status(500).json({ error: "Imeshindwa kutuma SMS. Jaribu tena." });
  }
});

// POST /api/sms/verify-otp
router.post("/verify-otp", (req: Request, res: Response) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "Nambari ya simu na OTP zinahitajika" });
  }

  const stored = otpStore.get(phone);

  if (!stored) return res.status(400).json({ error: "OTP haipatikani. Omba OTP upya." });
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return res.status(400).json({ error: "OTP imeisha muda. Omba OTP mpya." });
  }
  if (stored.attempts >= 3) {
    otpStore.delete(phone);
    return res.status(429).json({ error: "Majaribio mengi. Omba OTP mpya." });
  }

  stored.attempts++;

  if (stored.code !== code) {
    return res.status(400).json({ error: "OTP si sahihi. Jaribu tena." });
  }

  otpStore.delete(phone);
  res.json({ success: true, message: "Nambari imethibitishwa!" });
});

export default router;
