export interface PricingBreakdown {
  quantity: number;
  unitPrice: number;
  total: number;
  normalTotal: number;
  savings: number;
}

export interface AttributionData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  landing_page: string;
  referrer: string;
  fbp?: string;
  fbc?: string;
}

export interface OrderFormData {
  fullName: string;
  phone: string;
  email?: string;
  state?: string;
  deliveryAddress: string;
  quantity: number;
  paymentPreference: string;
  additionalMessage: string;
}

export interface MetaEventUserData {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaCustomData {
  currency?: string;
  value?: number;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  quantity?: number;
  num_items?: number;
  [key: string]: any;
}

export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "in_transit"
  | "delivered_paid"
  | "cancelled";

export interface CrmOrderEventStatus {
  sent: boolean;
  event_id?: string;
  sent_at?: string;
  status?: string;
  error?: string;
  meta_trace_id?: string;
}

export interface CrmOrder {
  id: string;
  order_reference: string;
  order_source?: string;
  product: string;
  product_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  state: string;
  delivery_address: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  total_savings: number;
  payment_preference: string;
  additional_instructions?: string;
  delivery_estimate?: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  attribution: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    fbclid?: string;
    fbp?: string;
    fbc?: string;
    landing_page?: string;
    referrer?: string;
    client_ip?: string;
    client_user_agent?: string;
  };
  capi_events: {
    lead?: CrmOrderEventStatus;
    purchase?: CrmOrderEventStatus;
  };
  notes?: Array<{
    id: string;
    text: string;
    author: string;
    created_at: string;
  }>;
}

export interface CapiConfig {
  pixelId: string;
  accessToken: string;
  testEventCode: string;
  autoFireLeadOnOrder: boolean;
  autoFirePurchaseOnDelivery: boolean;
  businessName: string;
  currency: string;
}

export interface CapiLogEntry {
  id: string;
  event_name: string;
  event_id: string;
  event_time: number;
  order_reference?: string;
  order_id?: string;
  user_match_keys: string[];
  custom_data_summary: {
    currency?: string;
    value?: number;
    num_items?: number;
  };
  status: "dispatched" | "logged_offline" | "error";
  meta_response?: any;
  error_message?: string;
  created_at: string;
}

export interface CrmStatusResponse {
  success: boolean;
  config: {
    pixelId: string;
    hasAccessToken: boolean;
    accessTokenMasked: string;
    testEventCode: string;
    autoFireLeadOnOrder: boolean;
    autoFirePurchaseOnDelivery: boolean;
    businessName: string;
    currency: string;
  };
  stats: {
    totalOrders: number;
    deliveredOrders: number;
    pendingCount: number;
    confirmedCount: number;
    transitCount: number;
    cancelledCount: number;
    totalRevenue: number;
    capiLeadsSent: number;
    capiPurchasesSent: number;
    totalLogs: number;
  };
}
