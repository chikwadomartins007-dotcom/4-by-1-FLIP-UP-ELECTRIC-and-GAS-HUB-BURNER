import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Ensure persistent directories exist
const dataDir = path.join(process.cwd(), "data");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

[dataDir, uploadsDirectory].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.error(`Failed to create directory ${dir}:`, e);
    }
  }
});

const ORDERS_FILE = path.join(dataDir, "crm_orders.json");
const CONFIG_FILE = path.join(dataDir, "capi_config.json");
const LOGS_FILE = path.join(dataDir, "capi_logs.json");

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
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) {
    digits = "234" + digits.substring(1);
  } else if (digits.length === 10) {
    digits = "234" + digits;
  }
  return crypto.createHash("sha256").update(digits).digest("hex");
}

// -------------------------------------------------------------
// CONFIGURATION STORE (Meta Conversions API & Business Settings)
// -------------------------------------------------------------
interface ServerCapiConfig {
  pixelId: string;
  accessToken: string;
  testEventCode: string;
  autoFireLeadOnOrder: boolean;
  autoFirePurchaseOnDelivery: boolean;
  businessName: string;
  currency: string;
}

function getCapiConfig(): ServerCapiConfig {
  const defaultEnvConfig: ServerCapiConfig = {
    pixelId: process.env.META_PIXEL_ID || "1730802201545460",
    accessToken: process.env.META_ACCESS_TOKEN || "",
    testEventCode: process.env.META_TEST_EVENT_CODE || "",
    autoFireLeadOnOrder: true,
    autoFirePurchaseOnDelivery: true,
    businessName: "MAX Luxury Bathrooms",
    currency: "NGN",
  };

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const stored = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      return {
        ...defaultEnvConfig,
        ...stored,
        // Allow env var override if stored token is empty
        accessToken: stored.accessToken || process.env.META_ACCESS_TOKEN || "",
        pixelId: stored.pixelId || process.env.META_PIXEL_ID || "1730802201545460",
        testEventCode: stored.testEventCode !== undefined ? stored.testEventCode : (process.env.META_TEST_EVENT_CODE || ""),
      };
    }
  } catch (e) {
    console.error("Error reading capi_config.json:", e);
  }
  return defaultEnvConfig;
}

function saveCapiConfig(newConfig: Partial<ServerCapiConfig>): ServerCapiConfig {
  const current = getCapiConfig();
  const updated = { ...current, ...newConfig };
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
  } catch (e) {
    console.error("Error writing capi_config.json:", e);
  }
  return updated;
}

// -------------------------------------------------------------
// LOGS STORE (Meta CAPI Transmissions Audit Trail)
// -------------------------------------------------------------
function appendCapiLog(logEntry: Record<string, any>) {
  try {
    let logs: any[] = [];
    if (fs.existsSync(LOGS_FILE)) {
      try {
        logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
      } catch {
        logs = [];
      }
    }
    const enriched = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      ...logEntry,
    };
    logs.unshift(enriched);
    // Keep last 150 log entries to prevent file bloat
    if (logs.length > 150) {
      logs = logs.slice(0, 150);
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Failed to append CAPI log:", err);
  }
}

function getCapiLogs(limit: number = 50): any[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      const logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
      return logs.slice(0, limit);
    }
  } catch (err) {
    console.error("Failed to read CAPI logs:", err);
  }
  return [];
}

// -------------------------------------------------------------
// ORDERS CRM STORE (Persistent JSON file)
// -------------------------------------------------------------
function readOrders(): any[] {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      // Seed initial sample orders for Nigerian kitchen direct-response e-commerce
      const seedOrders = [
        {
          id: "MAX-849201",
          order_reference: "MAX-849201",
          order_source: "Order Form",
          product: "Premium 5-Burner Built-In Gas + Electric Cooktop (Timer & Auto-Off Key)",
          product_code: "MAX-COOKTOP-5B",
          customer_name: "Chief Babatunde Adeleke",
          customer_phone: "08033221199",
          customer_email: "babatunde.adeleke@gmail.com",
          state: "Lagos",
          delivery_address: "Plot 14 Admiralty Way, Lekki Phase 1, Lagos",
          quantity: 2,
          unit_price: 275000,
          total_amount: 550000,
          total_savings: 10000,
          payment_preference: "Payment on Delivery (Subject to Location)",
          additional_instructions: "Please call on arrival, security at gate will direct you to Flat 4.",
          delivery_estimate: "1 - 2 business days",
          status: "delivered_paid",
          created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          attribution: {
            utm_source: "facebook",
            utm_medium: "cpc",
            utm_campaign: "cooktop_lagos_conversions_q3",
            fbclid: "fb.1.1718000000.IwAR2_SampleClickId992",
            fbp: "fb.1.1718000000.1234567890",
            fbc: "fb.1.1718000000.IwAR2_SampleClickId992",
            landing_page: "https://max-cooktops.ng/",
          },
          capi_events: {
            lead: {
              sent: true,
              event_id: "lead_MAX-849201",
              sent_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
              status: "dispatched",
            },
            purchase: {
              sent: true,
              event_id: "purchase_MAX-849201",
              sent_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
              status: "dispatched",
            },
          },
          notes: [
            {
              id: "note_1",
              text: "Customer confirmed 2 units for main kitchen and guest chalets. Delivered and cash paid on arrival.",
              author: "Lagos Dispatch Agent",
              created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
            },
          ],
        },
        {
          id: "MAX-912384",
          order_reference: "MAX-912384",
          order_source: "Quick Order Modal",
          product: "Premium 5-Burner Built-In Gas + Electric Cooktop (Timer & Auto-Off Key)",
          product_code: "MAX-COOKTOP-5B",
          customer_name: "Mrs. Nkechi Okafor",
          customer_phone: "08129988776",
          customer_email: "nkechi.okafor@yahoo.com",
          state: "Abuja (FCT)",
          delivery_address: "House 24, 4th Avenue, Gwarinpa Estate, Abuja",
          quantity: 1,
          unit_price: 280000,
          total_amount: 280000,
          total_savings: 70000,
          payment_preference: "Payment on Delivery (Subject to Location)",
          additional_instructions: "Kitchen renovation in progress, need delivery before weekend.",
          delivery_estimate: "2 - 3 business days",
          status: "in_transit",
          created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          attribution: {
            utm_source: "instagram",
            utm_medium: "story_ad",
            utm_campaign: "abuja_luxury_kitchen_upgrade",
            fbclid: "fb.1.1718100000.IwAR1_AbujaSampleClick",
            fbp: "fb.1.1718100000.9876543210",
          },
          capi_events: {
            lead: {
              sent: true,
              event_id: "lead_MAX-912384",
              sent_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
              status: "dispatched",
            },
          },
          notes: [
            {
              id: "note_2",
              text: "Waybill dispatched via Abuja express delivery partner. Tracking code shared with customer.",
              author: "Logistics Team",
              created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            },
          ],
        },
        {
          id: "MAX-748192",
          order_reference: "MAX-748192",
          order_source: "Order Form",
          product: "Premium 5-Burner Built-In Gas + Electric Cooktop (Timer & Auto-Off Key)",
          product_code: "MAX-COOKTOP-5B",
          customer_name: "Engr. Emeka Nwosu",
          customer_phone: "07065544332",
          customer_email: "emeka.nwosu@gmail.com",
          state: "Rivers",
          delivery_address: "18 Peter Odili Road, Trans Amadi, Port Harcourt",
          quantity: 1,
          unit_price: 280000,
          total_amount: 280000,
          total_savings: 70000,
          payment_preference: "Payment on Delivery (Subject to Location)",
          additional_instructions: "Call in the evening after 5pm.",
          delivery_estimate: "3 - 5 business days",
          status: "pending_confirmation",
          created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          attribution: {
            utm_source: "facebook",
            utm_medium: "feed",
            utm_campaign: "niger_delta_promo",
          },
          capi_events: {
            lead: {
              sent: true,
              event_id: "lead_MAX-748192",
              sent_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
              status: "dispatched",
            },
          },
          notes: [],
        },
      ];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(seedOrders, null, 2));
      return seedOrders;
    }
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading orders:", err);
    return [];
  }
}

function writeOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("Error writing orders:", err);
  }
}

// -------------------------------------------------------------
// CORE META CONVERSIONS API (CAPI) DISPATCH ENGINE
// -------------------------------------------------------------
interface DispatchCapiOptions {
  eventName: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    clientIp?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: Record<string, any>;
  orderReference?: string;
  orderId?: string;
}

async function sendMetaCapiEvent(options: DispatchCapiOptions): Promise<{
  success: boolean;
  dispatched: boolean;
  metaResult?: any;
  error?: string;
  eventId: string;
}> {
  const config = getCapiConfig();
  const {
    eventName,
    eventId,
    eventTime = Math.floor(Date.now() / 1000),
    eventSourceUrl = "https://max-cooktops.ng/",
    userData = {},
    customData = {},
    orderReference,
    orderId,
  } = options;

  // Build user_data with SHA-256 hashes according to Meta specification
  const capiUserData: Record<string, any> = {
    client_ip_address: userData.clientIp || undefined,
    client_user_agent: userData.clientUserAgent || undefined,
  };

  const userMatchKeys: string[] = [];

  if (userData.email) {
    const hashed = hashData(userData.email);
    if (hashed) {
      capiUserData.em = [hashed];
      userMatchKeys.push("em");
    }
  }

  if (userData.phone) {
    const hashed = hashPhone(userData.phone);
    if (hashed) {
      capiUserData.ph = [hashed];
      userMatchKeys.push("ph");
    }
  }

  if (userData.firstName) {
    const hashed = hashData(userData.firstName);
    if (hashed) {
      capiUserData.fn = [hashed];
      userMatchKeys.push("fn");
    }
  }

  if (userData.lastName) {
    const hashed = hashData(userData.lastName);
    if (hashed) {
      capiUserData.ln = [hashed];
      userMatchKeys.push("ln");
    }
  }

  if (userData.city) {
    const hashed = hashData(userData.city);
    if (hashed) {
      capiUserData.ct = [hashed];
      userMatchKeys.push("ct");
    }
  }

  if (userData.state) {
    const hashed = hashData(userData.state);
    if (hashed) {
      capiUserData.st = [hashed];
      userMatchKeys.push("st");
    }
  }

  // Country defaults to Nigeria (ng)
  const hashedCountry = hashData(userData.country || "ng");
  if (hashedCountry) {
    capiUserData.country = [hashedCountry];
    userMatchKeys.push("country");
  }

  if (userData.fbp) {
    capiUserData.fbp = userData.fbp;
    userMatchKeys.push("fbp");
  }
  if (userData.fbc) {
    capiUserData.fbc = userData.fbc;
    userMatchKeys.push("fbc");
  }

  if (userData.clientIp) userMatchKeys.push("client_ip");
  if (userData.clientUserAgent) userMatchKeys.push("client_user_agent");

  const eventPayload: Record<string, any> = {
    event_name: eventName,
    event_time: Number(eventTime),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: capiUserData,
    custom_data: {
      currency: config.currency || "NGN",
      ...customData,
    },
  };

  const pixelId = config.pixelId || "1730802201545460";
  const accessToken = config.accessToken;
  const testEventCode = config.testEventCode;

  // If accessToken is set, dispatch directly to Meta Graph API
  if (accessToken) {
    try {
      const endpoint = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
      const bodyPayload: Record<string, any> = {
        data: [eventPayload],
      };
      if (testEventCode && testEventCode.trim()) {
        bodyPayload.test_event_code = testEventCode.trim();
      }

      const metaRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const metaData = await metaRes.json();
      const isSuccess = metaRes.ok && (!metaData.error || metaData.events_received > 0);

      appendCapiLog({
        event_name: eventName,
        event_id: eventId,
        event_time: eventTime,
        order_reference: orderReference,
        order_id: orderId,
        user_match_keys: userMatchKeys,
        custom_data_summary: {
          currency: customData.currency || "NGN",
          value: customData.value,
          num_items: customData.num_items,
        },
        status: isSuccess ? "dispatched" : "error",
        meta_response: metaData,
        error_message: metaData.error ? JSON.stringify(metaData.error) : undefined,
      });

      return {
        success: isSuccess,
        dispatched: true,
        metaResult: metaData,
        eventId,
      };
    } catch (err: any) {
      appendCapiLog({
        event_name: eventName,
        event_id: eventId,
        event_time: eventTime,
        order_reference: orderReference,
        order_id: orderId,
        user_match_keys: userMatchKeys,
        custom_data_summary: {
          currency: customData.currency || "NGN",
          value: customData.value,
          num_items: customData.num_items,
        },
        status: "error",
        error_message: err.message,
      });

      return {
        success: false,
        dispatched: false,
        error: err.message,
        eventId,
      };
    }
  } else {
    // Development / token not configured: store in audit logs as logged_offline
    appendCapiLog({
      event_name: eventName,
      event_id: eventId,
      event_time: eventTime,
      order_reference: orderReference,
      order_id: orderId,
      user_match_keys: userMatchKeys,
      custom_data_summary: {
        currency: customData.currency || "NGN",
        value: customData.value,
        num_items: customData.num_items,
      },
      status: "logged_offline",
      meta_response: {
        note: "META_ACCESS_TOKEN not yet added in CRM settings. Event formatted with SHA-256 hashes and ready for dispatch.",
        pixelId,
        testEventCode: testEventCode || "None",
      },
    });

    return {
      success: true,
      dispatched: false,
      eventId,
    };
  }
}

// -------------------------------------------------------------
// CRM & META CONVERSIONS API REST ENDPOINTS
// -------------------------------------------------------------

// 1. Get CRM & Meta CAPI Status & Statistics
app.get("/api/crm/status", (req: Request, res: Response) => {
  try {
    const config = getCapiConfig();
    const orders = readOrders();
    const logs = getCapiLogs(100);

    const deliveredOrders = orders.filter((o) => o.status === "delivered_paid");
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const capiLeadsSent = orders.filter((o) => o.capi_events?.lead?.sent).length;
    const capiPurchasesSent = orders.filter((o) => o.capi_events?.purchase?.sent).length;

    const tokenMasked = config.accessToken
      ? `${config.accessToken.substring(0, 7)}...${config.accessToken.substring(config.accessToken.length - 5)}`
      : "";

    res.json({
      success: true,
      config: {
        pixelId: config.pixelId,
        hasAccessToken: Boolean(config.accessToken),
        accessTokenMasked: tokenMasked,
        testEventCode: config.testEventCode,
        autoFireLeadOnOrder: config.autoFireLeadOnOrder,
        autoFirePurchaseOnDelivery: config.autoFirePurchaseOnDelivery,
        businessName: config.businessName,
        currency: config.currency,
      },
      stats: {
        totalOrders: orders.length,
        deliveredOrders: deliveredOrders.length,
        pendingCount: orders.filter((o) => o.status === "pending_confirmation").length,
        confirmedCount: orders.filter((o) => o.status === "confirmed").length,
        transitCount: orders.filter((o) => o.status === "in_transit").length,
        cancelledCount: orders.filter((o) => o.status === "cancelled").length,
        totalRevenue,
        capiLeadsSent,
        capiPurchasesSent,
        totalLogs: logs.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Update Meta CAPI Configuration
app.post("/api/crm/config", (req: Request, res: Response) => {
  try {
    const {
      pixelId,
      accessToken,
      testEventCode,
      autoFireLeadOnOrder,
      autoFirePurchaseOnDelivery,
      businessName,
      currency,
    } = req.body;

    const updatePayload: Partial<ServerCapiConfig> = {};
    if (pixelId !== undefined) updatePayload.pixelId = String(pixelId).trim();
    if (accessToken !== undefined) updatePayload.accessToken = String(accessToken).trim();
    if (testEventCode !== undefined) updatePayload.testEventCode = String(testEventCode).trim();
    if (autoFireLeadOnOrder !== undefined) updatePayload.autoFireLeadOnOrder = Boolean(autoFireLeadOnOrder);
    if (autoFirePurchaseOnDelivery !== undefined) updatePayload.autoFirePurchaseOnDelivery = Boolean(autoFirePurchaseOnDelivery);
    if (businessName !== undefined) updatePayload.businessName = String(businessName).trim();
    if (currency !== undefined) updatePayload.currency = String(currency).trim();

    const saved = saveCapiConfig(updatePayload);

    res.json({
      success: true,
      message: "Meta Conversions API configuration updated successfully",
      config: {
        ...saved,
        accessTokenMasked: saved.accessToken
          ? `${saved.accessToken.substring(0, 7)}...${saved.accessToken.substring(saved.accessToken.length - 5)}`
          : "",
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Send a Live Test Event to Meta Conversions API (for Events Manager Test Events tab verification)
app.post("/api/crm/test-event", async (req: Request, res: Response) => {
  try {
    const { testEventCode, eventName = "TestEvent" } = req.body;
    const config = getCapiConfig();

    if (testEventCode) {
      saveCapiConfig({ testEventCode: testEventCode.trim() });
    }

    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "102.89.23.45";
    const clientUserAgent = req.headers["user-agent"] || "Mozilla/5.0 CRM Test Runner";

    const testEventId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const result = await sendMetaCapiEvent({
      eventName: eventName === "Purchase" ? "Purchase" : eventName === "Lead" ? "Lead" : "TestEvent",
      eventId: testEventId,
      eventSourceUrl: req.headers.referer || "https://max-cooktops.ng/",
      userData: {
        email: "test.crm@max-cooktops.ng",
        phone: "08012345678",
        firstName: "Test",
        lastName: "CRM Admin",
        city: "Ikeja",
        state: "Lagos",
        country: "ng",
        clientIp,
        clientUserAgent,
        fbp: `fb.1.${Math.floor(Date.now() / 1000)}.1234567890`,
      },
      customData: {
        currency: "NGN",
        value: 280000,
        content_name: "5-Burner Built-In Gas + Electric Cooktop",
        content_ids: ["MAX-COOKTOP-5B"],
        content_type: "product",
        num_items: 1,
        test_run: true,
      },
      orderReference: "TEST-CRM-VERIFY",
    });

    res.json({
      success: true,
      result,
      pixelId: config.pixelId,
      hasAccessToken: Boolean(config.accessToken),
      testEventCode: testEventCode || config.testEventCode || "None",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get CRM Orders (with optional filter by status or search)
app.get("/api/crm/orders", (req: Request, res: Response) => {
  try {
    let orders = readOrders();
    const { status, search } = req.query;

    if (status && typeof status === "string" && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    if (search && typeof search === "string" && search.trim()) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_phone?.includes(q) ||
          o.order_reference?.toLowerCase().includes(q) ||
          o.state?.toLowerCase().includes(q) ||
          o.delivery_address?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Create Order endpoint (unified for OrderForm and QuickOrderModal)
app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      state = "Lagos",
      delivery_address,
      quantity = 1,
      payment_preference = "Payment on Delivery",
      additional_instructions = "",
      delivery_estimate = "1 - 3 business days",
      order_source = "Order Form",
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      fbclid,
      fbp,
      fbc,
      landing_page,
      referrer,
      explicit_event_id,
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: customer_name, customer_phone, and delivery_address are mandatory.",
      });
    }

    const pricing = calculatePricing(Number(quantity));
    const orderRef = `MAX-${Date.now().toString().slice(-6)}`;
    const orderId = orderRef;
    const nowIso = new Date().toISOString();

    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const clientUserAgent = req.headers["user-agent"] || "";

    const names = customer_name.trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    const leadEventId = explicit_event_id || `lead_${orderRef}`;

    const newOrder: any = {
      id: orderId,
      order_reference: orderRef,
      order_source,
      product: "Premium 5-Burner Built-In Gas + Electric Cooktop (Timer & Auto-Off Key)",
      product_code: "MAX-COOKTOP-5B",
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email?.trim() || undefined,
      state: state.trim(),
      delivery_address: delivery_address.trim(),
      quantity: pricing.quantity,
      unit_price: pricing.unitPrice,
      total_amount: pricing.total,
      total_savings: pricing.savings,
      payment_preference,
      additional_instructions: additional_instructions?.trim() || "None",
      delivery_estimate,
      status: "pending_confirmation",
      created_at: nowIso,
      updated_at: nowIso,
      attribution: {
        utm_source: utm_source || "direct",
        utm_medium: utm_medium || "",
        utm_campaign: utm_campaign || "",
        utm_content: utm_content || "",
        utm_term: utm_term || "",
        fbclid: fbclid || "",
        fbp: fbp || "",
        fbc: fbc || "",
        landing_page: landing_page || "",
        referrer: referrer || "",
        client_ip: clientIp,
        client_user_agent: clientUserAgent,
      },
      capi_events: {
        lead: {
          sent: false,
          event_id: leadEventId,
          sent_at: undefined,
          status: "pending",
        },
      },
      notes: [],
    };

    const config = getCapiConfig();

    // 1. Immediately fire Meta CAPI Lead Event server-side
    if (config.autoFireLeadOnOrder) {
      const capiResult = await sendMetaCapiEvent({
        eventName: "Lead",
        eventId: leadEventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: landing_page || req.headers.referer || "https://max-cooktops.ng/",
        userData: {
          email: customer_email,
          phone: customer_phone,
          firstName,
          lastName,
          city: state,
          state,
          country: "ng",
          clientIp,
          clientUserAgent,
          fbp,
          fbc,
        },
        customData: {
          currency: "NGN",
          value: pricing.total,
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_ids: ["MAX-COOKTOP-5B"],
          content_category: "Kitchen Appliances",
          num_items: pricing.quantity,
          order_id: orderRef,
        },
        orderReference: orderRef,
        orderId,
      });

      newOrder.capi_events.lead = {
        sent: capiResult.success,
        event_id: leadEventId,
        sent_at: new Date().toISOString(),
        status: capiResult.dispatched ? "dispatched" : "logged_offline",
        meta_trace_id: capiResult.metaResult?.fbtrace_id,
        error: capiResult.error,
      };
    }

    // 2. Persist order into CRM
    const orders = readOrders();
    orders.unshift(newOrder);
    writeOrders(orders);

    // 3. Asynchronously forward to Formspree for email notification backup
    fetch("https://formspree.io/f/xaeyaklo", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...req.body,
        order_reference: orderRef,
        total_amount: pricing.total,
        quantity: pricing.quantity,
        submission_time: nowIso,
      }),
    }).catch((e) => console.warn("Formspree backup notification notice:", e.message));

    res.json({
      success: true,
      order: newOrder,
      orderReference: orderRef,
      eventId: leadEventId,
      pricing,
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Update Order Status (Crucial: Transition to "delivered_paid" fires Meta CAPI Purchase event!)
app.patch("/api/crm/orders/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, noteText, noteAuthor = "Staff" } = req.body;

    const orders = readOrders();
    const orderIndex = orders.findIndex((o) => o.id === id || o.order_reference === id);

    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const order = orders[orderIndex];
    const prevStatus = order.status;
    const nowIso = new Date().toISOString();

    if (status) {
      order.status = status;
      order.updated_at = nowIso;
    }

    if (noteText && String(noteText).trim()) {
      if (!order.notes) order.notes = [];
      order.notes.push({
        id: `note_${Date.now()}`,
        text: String(noteText).trim(),
        author: noteAuthor,
        created_at: nowIso,
      });
    }

    const config = getCapiConfig();
    let purchaseCapiResult: any = null;

    // AUTOMATIC META CAPI PURCHASE EVENT:
    // If order is changed to 'delivered_paid' and purchase has not been sent yet
    if (
      status === "delivered_paid" &&
      config.autoFirePurchaseOnDelivery &&
      !order.capi_events?.purchase?.sent
    ) {
      const purchaseEventId = `purchase_${order.order_reference}`;
      const names = (order.customer_name || "").trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      purchaseCapiResult = await sendMetaCapiEvent({
        eventName: "Purchase",
        eventId: purchaseEventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: order.attribution?.landing_page || "https://max-cooktops.ng/",
        userData: {
          email: order.customer_email,
          phone: order.customer_phone,
          firstName,
          lastName,
          city: order.state,
          state: order.state,
          country: "ng",
          clientIp: order.attribution?.client_ip,
          clientUserAgent: order.attribution?.client_user_agent,
          fbp: order.attribution?.fbp,
          fbc: order.attribution?.fbc,
        },
        customData: {
          currency: "NGN",
          value: Number(order.total_amount),
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_ids: ["MAX-COOKTOP-5B"],
          content_type: "product",
          num_items: Number(order.quantity || 1),
          order_id: order.order_reference,
        },
        orderReference: order.order_reference,
        orderId: order.id,
      });

      if (!order.capi_events) order.capi_events = {};
      order.capi_events.purchase = {
        sent: purchaseCapiResult.success,
        event_id: purchaseEventId,
        sent_at: nowIso,
        status: purchaseCapiResult.dispatched ? "dispatched" : "logged_offline",
        meta_trace_id: purchaseCapiResult.metaResult?.fbtrace_id,
        error: purchaseCapiResult.error,
      };

      if (!order.notes) order.notes = [];
      order.notes.push({
        id: `note_capi_${Date.now()}`,
        text: `⚡ Meta Conversions API Purchase Event automatically dispatched (Amount: ₦${order.total_amount.toLocaleString()}, EventID: ${purchaseEventId})`,
        author: "Meta CAPI Engine",
        created_at: nowIso,
      });
    }

    orders[orderIndex] = order;
    writeOrders(orders);

    res.json({
      success: true,
      message: `Order updated from ${prevStatus} to ${status}`,
      order,
      purchaseCapiResult,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Manually Trigger a CAPI event for an order (Purchase or Lead)
app.post("/api/crm/orders/:id/send-capi", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { eventType = "Purchase" } = req.body;

    const orders = readOrders();
    const order = orders.find((o) => o.id === id || o.order_reference === id);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const eventName = eventType === "Lead" ? "Lead" : "Purchase";
    const eventId = `${eventName.toLowerCase()}_manual_${order.order_reference}_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const names = (order.customer_name || "").trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    const capiResult = await sendMetaCapiEvent({
      eventName,
      eventId,
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: order.attribution?.landing_page || "https://max-cooktops.ng/",
      userData: {
        email: order.customer_email,
        phone: order.customer_phone,
        firstName,
        lastName,
        city: order.state,
        state: order.state,
        country: "ng",
        clientIp: order.attribution?.client_ip,
        clientUserAgent: order.attribution?.client_user_agent,
        fbp: order.attribution?.fbp,
        fbc: order.attribution?.fbc,
      },
      customData: {
        currency: "NGN",
        value: Number(order.total_amount),
        content_name: "5-Burner Built-In Gas + Electric Cooktop",
        content_ids: ["MAX-COOKTOP-5B"],
        content_type: "product",
        num_items: Number(order.quantity || 1),
        order_id: order.order_reference,
      },
      orderReference: order.order_reference,
      orderId: order.id,
    });

    if (!order.capi_events) order.capi_events = {};
    if (eventName === "Purchase") {
      order.capi_events.purchase = {
        sent: capiResult.success,
        event_id: eventId,
        sent_at: nowIso,
        status: capiResult.dispatched ? "dispatched" : "logged_offline",
        meta_trace_id: capiResult.metaResult?.fbtrace_id,
        error: capiResult.error,
      };
    } else {
      order.capi_events.lead = {
        sent: capiResult.success,
        event_id: eventId,
        sent_at: nowIso,
        status: capiResult.dispatched ? "dispatched" : "logged_offline",
        meta_trace_id: capiResult.metaResult?.fbtrace_id,
        error: capiResult.error,
      };
    }

    if (!order.notes) order.notes = [];
    order.notes.push({
      id: `note_manual_${Date.now()}`,
      text: `Manual Meta CAPI ${eventName} triggered (Event ID: ${eventId})`,
      author: "Staff",
      created_at: nowIso,
    });

    const orderIdx = orders.findIndex((o) => o.id === order.id);
    orders[orderIdx] = order;
    writeOrders(orders);

    res.json({
      success: true,
      message: `Meta CAPI ${eventName} dispatched`,
      capiResult,
      order,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Delete an order
app.delete("/api/crm/orders/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let orders = readOrders();
    const beforeCount = orders.length;
    orders = orders.filter((o) => o.id !== id && o.order_reference !== id);

    if (orders.length === beforeCount) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    writeOrders(orders);
    res.json({ success: true, message: "Order removed from CRM" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Get CAPI Logs
app.get("/api/crm/logs", (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const logs = getCapiLogs(limit);
    res.json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Webhook endpoint for External CRMs / Zapier / Logistics integration
app.post("/api/crm/webhook", async (req: Request, res: Response) => {
  try {
    const { order_reference, order_id, status, paid_amount, event } = req.body;
    const targetRef = order_reference || order_id;

    if (!targetRef) {
      return res.status(400).json({
        success: false,
        error: "Missing order_reference or order_id in webhook payload",
      });
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex(
      (o) => o.order_reference === targetRef || o.id === targetRef
    );

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Order with reference ${targetRef} not found in CRM`,
      });
    }

    const order = orders[orderIndex];
    const newStatus = status === "delivered" || status === "paid" ? "delivered_paid" : status;

    if (newStatus) {
      order.status = newStatus;
      order.updated_at = new Date().toISOString();
    }

    if (!order.notes) order.notes = [];
    order.notes.push({
      id: `webhook_${Date.now()}`,
      text: `External CRM Webhook update received: Status -> ${newStatus || "No change"}`,
      author: "External CRM Webhook",
      created_at: new Date().toISOString(),
    });

    let capiDispatched = false;
    if (newStatus === "delivered_paid" && !order.capi_events?.purchase?.sent) {
      const purchaseEventId = `purchase_${order.order_reference}`;
      const names = (order.customer_name || "").trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      const capiResult = await sendMetaCapiEvent({
        eventName: "Purchase",
        eventId: purchaseEventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: order.attribution?.landing_page || "https://max-cooktops.ng/",
        userData: {
          email: order.customer_email,
          phone: order.customer_phone,
          firstName,
          lastName,
          city: order.state,
          state: order.state,
          country: "ng",
          clientIp: order.attribution?.client_ip,
          clientUserAgent: order.attribution?.client_user_agent,
          fbp: order.attribution?.fbp,
          fbc: order.attribution?.fbc,
        },
        customData: {
          currency: "NGN",
          value: Number(paid_amount || order.total_amount),
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_ids: ["MAX-COOKTOP-5B"],
          content_type: "product",
          num_items: Number(order.quantity || 1),
          order_id: order.order_reference,
        },
        orderReference: order.order_reference,
        orderId: order.id,
      });

      if (!order.capi_events) order.capi_events = {};
      order.capi_events.purchase = {
        sent: capiResult.success,
        event_id: purchaseEventId,
        sent_at: new Date().toISOString(),
        status: capiResult.dispatched ? "dispatched" : "logged_offline",
        meta_trace_id: capiResult.metaResult?.fbtrace_id,
        error: capiResult.error,
      };
      capiDispatched = capiResult.success;
    }

    orders[orderIndex] = order;
    writeOrders(orders);

    res.json({
      success: true,
      message: "Webhook processed and CRM synchronized",
      orderReference: order.order_reference,
      status: order.status,
      metaCapiPurchaseFired: capiDispatched,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Legacy CAPI proxy endpoint (maintained for backwards compatibility)
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

    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const clientUserAgent = req.headers["user-agent"] || "";

    const result = await sendMetaCapiEvent({
      eventName: event_name,
      eventId: event_id,
      eventTime: Number(event_time),
      eventSourceUrl: event_source_url || req.headers.referer || "",
      userData: {
        email: user_data.email,
        phone: user_data.phone,
        firstName: user_data.first_name,
        lastName: user_data.last_name,
        city: user_data.city,
        state: user_data.state,
        country: user_data.country || "ng",
        clientIp,
        clientUserAgent,
        fbp: user_data.fbp,
        fbc: user_data.fbc,
      },
      customData: custom_data,
    });

    res.json({
      success: result.success,
      dispatched: result.dispatched,
      eventId: result.eventId,
      metaResult: result.metaResult,
      error: result.error,
    });
  } catch (err: any) {
    res.json({ success: false, error: err?.message });
  }
});

// 12. Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  const config = getCapiConfig();
  res.json({
    status: "ok",
    business: config.businessName,
    product: "5-Burner Built-In Gas + Electric Cooktop",
    pixelId: config.pixelId,
    hasMetaAccessToken: Boolean(config.accessToken),
    testEventCode: config.testEventCode || "None",
    timestamp: new Date().toISOString(),
  });
});

// 13. Centralized pricing verification endpoint
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

// 14. Custom Image Upload endpoint
app.post("/api/upload-image", (req: Request, res: Response) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ success: false, error: "dataUrl is required" });
    }

    const matches = dataUrl.match(/^data:([A-Za-z0-9\/-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: "Invalid dataUrl format" });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    let ext = "png";
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("gif")) ext = "gif";
    else if (mimeType.includes("svg")) ext = "svg";

    const baseName = filename ? path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, "_") : "custom_image";
    const safeName = `${baseName}_${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDirectory, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({
      success: true,
      url: publicUrl,
      name: safeName,
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to upload image" });
  }
});

// 15. Direct raw image upload endpoint
app.post("/api/upload-after-image", express.json({ limit: "50mb" }), (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "No image data provided" });
    }
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const publicPath = path.join(process.cwd(), "public", "exact_kitchen_after.jpg");
    fs.writeFileSync(publicPath, buffer);

    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, "exact_kitchen_after.jpg"), buffer);
    }

    res.json({ success: true, path: "/exact_kitchen_after.jpg" });
  } catch (err: any) {
    console.error("Failed to write uploaded image:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER & PRODUCTION STATIC SERVER
// -------------------------------------------------------------
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
    console.log(`Server running on port ${PORT} with CRM & Meta Conversions API active`);
  });
}

startServer();
