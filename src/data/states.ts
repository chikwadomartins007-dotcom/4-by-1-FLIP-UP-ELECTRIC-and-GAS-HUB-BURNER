export interface StateOption {
  value: string;
  label: string;
  deliveryTime: string;
  badge?: string;
}

export const NIGERIAN_STATES: StateOption[] = [
  { value: "Lagos", label: "Lagos State", deliveryTime: "Same-Day / 24 Hours", badge: "Fastest Delivery" },
  { value: "Abuja", label: "Abuja (FCT)", deliveryTime: "24 - 48 Hours", badge: "Express Dispatch" },
  { value: "Rivers", label: "Rivers (Port Harcourt)", deliveryTime: "24 - 48 Hours", badge: "Direct Courier" },
  { value: "Ogun", label: "Ogun State", deliveryTime: "24 - 48 Hours" },
  { value: "Oyo", label: "Oyo State (Ibadan)", deliveryTime: "24 - 48 Hours" },
  { value: "Anambra", label: "Anambra (Onitsha / Awka)", deliveryTime: "2 - 3 Days" },
  { value: "Enugu", label: "Enugu State", deliveryTime: "2 - 3 Days" },
  { value: "Edo", label: "Edo (Benin City)", deliveryTime: "2 - 3 Days" },
  { value: "Delta", label: "Delta (Warri / Asaba)", deliveryTime: "2 - 3 Days" },
  { value: "Imo", label: "Imo State (Owerri)", deliveryTime: "2 - 3 Days" },
  { value: "Abia", label: "Abia (Aba / Umuahia)", deliveryTime: "2 - 3 Days" },
  { value: "Akwa Ibom", label: "Akwa Ibom (Uyo)", deliveryTime: "2 - 3 Days" },
  { value: "Kano", label: "Kano State", deliveryTime: "2 - 3 Days" },
  { value: "Kaduna", label: "Kaduna State", deliveryTime: "2 - 3 Days" },
  { value: "Ondo", label: "Ondo State (Akure)", deliveryTime: "2 - 3 Days" },
  { value: "Kwara", label: "Kwara (Ilorin)", deliveryTime: "2 - 3 Days" },
  { value: "Osun", label: "Osun State", deliveryTime: "2 - 3 Days" },
  { value: "Cross River", label: "Cross River (Calabar)", deliveryTime: "3 - 4 Days" },
  { value: "Plateau", label: "Plateau State (Jos)", deliveryTime: "3 - 4 Days" },
  { value: "Bayelsa", label: "Bayelsa State (Yenagoa)", deliveryTime: "3 - 4 Days" },
  { value: "Other", label: "Other States in Nigeria", deliveryTime: "2 - 4 Days Nationwide" },
];
