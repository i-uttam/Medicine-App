import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const router: IRouter = Router();

// In-memory OTP store: key (email/phone) → { otp, expiresAt, attempts }
const otpStore = new Map<
  string,
  { otp: string; expiresAt: number; attempts: number }
>();

// Send-rate limiter: key → last send timestamp
const sendCooldown = new Map<string, number>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SEND_COOLDOWN_MS = 60 * 1000; // 1 resend per minute
const MAX_VERIFY_ATTEMPTS = 5; // lockout after 5 wrong guesses

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp
router.post("/auth/send-otp", async (req, res) => {
  const { email, phone } = req.body as { email?: string; phone?: string };

  if (!email && !phone) {
    res.status(400).json({ error: "email or phone is required" });
    return;
  }

  if (phone && !email) {
    res.status(400).json({
      error: "Phone OTP is not supported yet. Please use email login.",
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Email service is not configured." });
    return;
  }

  const key = email!.toLowerCase();

  // Cooldown check — prevent spamming
  const lastSent = sendCooldown.get(key);
  if (lastSent && Date.now() - lastSent < SEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((SEND_COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
    res
      .status(429)
      .json({ error: `Please wait ${waitSec}s before requesting another OTP.` });
    return;
  }

  const otp = generateOtp();

  try {
    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "MediWholesale <onboarding@resend.dev>",
      to: [email!],
      subject: `${otp} is your MediWholesale OTP`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <div style="margin-bottom:24px;">
            <span style="background:#0F9D58;color:#fff;font-size:13px;font-weight:600;
              padding:6px 14px;border-radius:20px;">MediWholesale</span>
          </div>
          <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:22px;">Your login OTP</h2>
          <p style="color:#555;margin:0 0 24px;font-size:15px;">
            Use the code below to sign in. It expires in <strong>5 minutes</strong>.
          </p>
          <div style="background:#f0f9f4;border:2px solid #0F9D58;border-radius:12px;
            padding:28px;text-align:center;margin-bottom:24px;">
            <span style="font-size:44px;font-weight:700;letter-spacing:14px;color:#0F9D58;">
              ${otp}
            </span>
          </div>
          <p style="color:#888;font-size:13px;">
            If you didn't request this, you can safely ignore this email.
            Never share this code with anyone.
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error("Resend API error:", sendError);
      res.status(500).json({ error: "Failed to send OTP. Please try again." });
      return;
    }

    // Only store OTP after confirmed delivery
    otpStore.set(key, { otp, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
    sendCooldown.set(key, Date.now());

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// POST /api/auth/verify-otp
router.post("/auth/verify-otp", async (req, res) => {
  const { email, phone, otp } = req.body as {
    email?: string;
    phone?: string;
    otp?: string;
  };

  if (!otp) {
    res.status(400).json({ error: "otp is required" });
    return;
  }

  const key = email ? email.toLowerCase() : phone;
  if (!key) {
    res.status(400).json({ error: "email or phone is required" });
    return;
  }

  const stored = otpStore.get(key);
  if (!stored) {
    res.status(400).json({
      error: "No OTP found. Please request a new one.",
    });
    return;
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key);
    res.status(400).json({ error: "OTP has expired. Please request a new one." });
    return;
  }

  // Increment attempt count before checking
  stored.attempts += 1;
  if (stored.attempts > MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(key);
    res.status(429).json({
      error: "Too many incorrect attempts. Please request a new OTP.",
    });
    return;
  }

  if (stored.otp !== otp) {
    const remaining = MAX_VERIFY_ATTEMPTS - stored.attempts;
    res.status(400).json({
      error:
        remaining > 0
          ? `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many incorrect attempts. Please request a new OTP.",
    });
    if (remaining <= 0) otpStore.delete(key);
    return;
  }

  // Valid — consume it
  otpStore.delete(key);

  try {
    const whereClause = email
      ? eq(usersTable.email, email.toLowerCase())
      : eq(usersTable.phone, phone!);

    const existing = await db
      .select()
      .from(usersTable)
      .where(whereClause)
      .limit(1);

    if (existing.length > 0) {
      res.json({ user: existing[0] });
      return;
    }

    const created = await db
      .insert(usersTable)
      .values({
        email: email ? email.toLowerCase() : null,
        phone: phone ?? null,
      })
      .returning();

    res.json({ user: created[0] });
  } catch (err) {
    console.error("DB error during verify-otp:", err);
    res.status(500).json({ error: "Account lookup failed. Please try again." });
  }
});

// POST /api/auth/login — legacy phone-based login/register
router.post("/auth/login", async (req, res) => {
  const { phone, name } = req.body as { phone?: string; name?: string };

  if (!phone) {
    res.status(400).json({ error: "phone is required" });
    return;
  }

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.phone, phone))
    .limit(1);

  if (existing.length > 0) {
    res.json(existing[0]);
    return;
  }

  const created = await db
    .insert(usersTable)
    .values({ phone, name: name ?? null })
    .returning();

  res.json(created[0]);
});

export default router;
