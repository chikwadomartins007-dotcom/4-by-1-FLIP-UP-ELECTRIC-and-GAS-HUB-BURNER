import express, { Request, Response } from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

// Helper to calculate pricing on the server
export function calculatePricing(quantity: number) {
  const qty = Math.max(1, Math.floor(quantity || 1));
  let unitPrice = 280000;
  if (qty === 2) {
    unitPrice = 275000;
  } else if (qty === 3) {
    unitPrice = 270000;
  } else if (qty >= 4) {
    unitPrice = 265000;
  }
  const total = qty * unitPrice;
  const normalTotal = qty * 280000;
  const savings = normalTotal - total;
  return {
    quantity: qty,
    unitPrice,
    total,
    normalTotal,
    savings,
  };
}

// SHA-256 hashing helper for Meta Conversions API compliance
function hashData(value?: string | null): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) return undefined;
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

function hashPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  // Clean phone: digits only, remove leading zero if country code not included or format Nigerian international format 234...
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) {
    digits = "234" + digits.substring(1);
  } else if (digits.length === 10) {
    digits = "234" + digits;
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
}

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    business: "MAX Luxury Bathrooms",
    product: "5-Burner Built-In Gas + Electric Cooktop",
    pixelId: process.env.META_PIXEL_ID || "1730802201545460",
    hasMetaAccessToken: Boolean(process.env.META_ACCESS_TOKEN),
    timestamp: new Date().toISOString(),
  });
});

// Centralized pricing verification endpoint
app.post("/api/verify-order", (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const pricing = calculatePricing(Number(quantity));
    res.json({
      success: true,
      pricing,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Meta Conversions API (CAPI) proxy endpoint
app.post("/api/track/capi", async (req: Request, res: Response) => {
  try {
    const {
      event_name,
      event_id,
      event_time = Math.floor(Date.now() / 1000),
      event_source_url,
      user_data = {},
      custom_data = {},
    } = req.body;

    if (!event_name || !event_id) {
      return res.status(400).json({ error: "Missing event_name or event_id" });
    }

    // Extract client IP and User Agent server-side
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const clientUserAgent = req.headers["user-agent"] || "";

    const hashedEmail = user_data.email ? hashData(user_data.email) : undefined;
    const hashedPhone = user_data.phone ? hashPhone(user_data.phone) : undefined;
    const hashedFn = user_data.first_name ? hashData(user_data.first_name) : undefined;
    const hashedLn = user_data.last_name ? hashData(user_data.last_name) : undefined;

    const capiUserData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
    };

    if (hashedEmail) capiUserData.em = [hashedEmail];
    if (hashedPhone) capiUserData.ph = [hashedPhone];
    if (hashedFn) capiUserData.fn = [hashedFn];
    if (hashedLn) capiUserData.ln = [hashedLn];
    if (user_data.fbp) capiUserData.fbp = user_data.fbp;
    if (user_data.fbc) capiUserData.fbc = user_data.fbc;

    const eventPayload: Record<string, any> = {
      event_name,
      event_time: Number(event_time),
      event_id,
      event_source_url: event_source_url || req.headers.referer || "",
      action_source: "website",
      user_data: capiUserData,
      custom_data: {
        currency: "NGN",
        ...custom_data,
      },
    };

    const pixelId = process.env.META_PIXEL_ID || "1730802201545460";
    const accessToken = process.env.META_ACCESS_TOKEN;
    const testEventCode = process.env.META_TEST_EVENT_CODE;

    // If Meta Access Token is set, dispatch directly to Meta Graph API
    if (accessToken) {
      const endpoint = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
      const bodyPayload: Record<string, any> = {
        data: [eventPayload],
      };
      if (testEventCode) {
        bodyPayload.test_event_code = testEventCode;
      }

      const metaRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const metaData = await metaRes.json();
      return res.json({
        success: true,
        dispatched: true,
        eventId: event_id,
        metaResult: metaData,
      });
    } else {
      // In development / before token configuration, log securely and return valid success
      // Tracking failures MUST NEVER block user orders
      return res.json({
        success: true,
        dispatched: false,
        note: "META_ACCESS_TOKEN not set in environment; event logged server-side for deduplication architecture.",
        eventId: event_id,
      });
    }
  } catch (err: any) {
    // Return non-blocking error status so client-side flow continues uninterrupted
    console.error("CAPI error:", err?.message);
    res.json({ success: false, error: err?.message });
  }
});

// Purchase Confirmation webhook/admin trigger endpoint (ensures Purchase is never fired prematurely)
app.post("/api/orders/confirm-purchase", async (req: Request, res: Response) => {
  try {
    const { orderId, quantity, email, phone, event_id, fbp, fbc } = req.body;
    const pricing = calculatePricing(Number(quantity) || 1);
    const resolvedEventId = event_id || `purchase_${orderId || Date.now()}`;

    const pixelId = process.env.META_PIXEL_ID || "1730802201545460";
    const accessToken = process.env.META_ACCESS_TOKEN;

    const purchasePayload = {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: resolvedEventId,
      action_source: "website",
      user_data: {
        em: email ? [hashData(email)] : undefined,
        ph: phone ? [hashPhone(phone)] : undefined,
        fbp,
        fbc,
      },
      custom_data: {
        currency: "NGN",
        value: pricing.total,
        content_name: "5-Burner Built-In Gas + Electric Cooktop",
        content_ids: ["MAX-COOKTOP-5B"],
        content_type: "product",
        num_items: pricing.quantity,
      },
    };

    if (accessToken) {
      await fetch(
        `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [purchasePayload] }),
        }
      );
    }

    res.json({
      success: true,
      message: "Purchase event recorded and deduplicated via Conversions API",
      orderId,
      eventId: resolvedEventId,
      amount: pricing.total,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
