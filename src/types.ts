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
