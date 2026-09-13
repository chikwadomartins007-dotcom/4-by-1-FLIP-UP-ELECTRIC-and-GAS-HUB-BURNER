import { AttributionData } from "../types";

const STORAGE_KEY = "max_luxury_attribution_data";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : "";
}

export function initAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      fbclid: "",
      landing_page: "",
      referrer: "",
    };
  }

  // Check if we already have attribution saved in sessionStorage
  const cached = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  let savedData: Partial<AttributionData> = {};
  if (cached) {
    try {
      savedData = JSON.parse(cached);
    } catch {
      // ignore json parse error
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source") || savedData.utm_source || "";
  const utm_medium = urlParams.get("utm_medium") || savedData.utm_medium || "";
  const utm_campaign = urlParams.get("utm_campaign") || savedData.utm_campaign || "";
  const utm_content = urlParams.get("utm_content") || savedData.utm_content || "";
  const utm_term = urlParams.get("utm_term") || savedData.utm_term || "";
  const fbclid = urlParams.get("fbclid") || savedData.fbclid || "";

  const landing_page = savedData.landing_page || window.location.href;
  const referrer = savedData.referrer || document.referrer || "";

  const fbp = getCookie("_fbp") || savedData.fbp || "";
  const fbc = getCookie("_fbc") || savedData.fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");

  const fullData: AttributionData = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    fbclid,
    landing_page,
    referrer,
    fbp,
    fbc,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
  } catch {
    // Storage quota or private mode safe
  }

  return fullData;
}

export function getAttribution(): AttributionData {
  return initAttribution();
}
