export const SITE_CONFIG = {
  name: "Soko Link",
  tagline: "Soko la Tanzania Nzima",
  description: "Tanzania's #1 Online Marketplace",
  url: "https://sokolink.co.tz",
  email: "support@sokolink.co.tz",
  phone: "+255 700 000 000",
  address: "Dar es Salaam, Tanzania",
  social: {
    instagram: "@sokolinktz",
    twitter: "@sokolinktz",
    facebook: "SokoLinkTZ",
    whatsapp: "+255700000000",
  },
};

export const PRODUCT_CATEGORIES = [
  { id: "electronics", name: "Elektroniki", icon: "📱", slug: "electronics" },
  { id: "fashion", name: "Mavazi", icon: "👗", slug: "fashion" },
  { id: "food", name: "Chakula", icon: "🍎", slug: "food" },
  { id: "home", name: "Nyumba", icon: "🏠", slug: "home" },
  { id: "beauty", name: "Uzuri", icon: "💄", slug: "beauty" },
  { id: "sports", name: "Michezo", icon: "⚽", slug: "sports" },
  { id: "books", name: "Vitabu", icon: "📚", slug: "books" },
  { id: "automotive", name: "Magari", icon: "🚗", slug: "automotive" },
  { id: "agriculture", name: "Kilimo", icon: "🌾", slug: "agriculture" },
  { id: "health", name: "Afya", icon: "💊", slug: "health" },
];

export const DELIVERY_ZONES = [
  { id: "dse-central", name: "Dar es Salaam - Kati", fee: 2000, days: 1 },
  { id: "dse-outer", name: "Dar es Salaam - Nje", fee: 3500, days: 1 },
  { id: "arusha", name: "Arusha", fee: 8000, days: 2 },
  { id: "mwanza", name: "Mwanza", fee: 10000, days: 3 },
  { id: "dodoma", name: "Dodoma", fee: 8500, days: 2 },
  { id: "moshi", name: "Moshi", fee: 8000, days: 2 },
  { id: "zanzibar", name: "Zanzibar", fee: 12000, days: 3 },
  { id: "tanga", name: "Tanga", fee: 7000, days: 2 },
  { id: "morogoro", name: "Morogoro", fee: 6000, days: 2 },
  { id: "mbeya", name: "Mbeya", fee: 12000, days: 3 },
];

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_METHODS = {
  MPESA: "mpesa",
  AIRTEL_MONEY: "airtel_money",
  TIGO_PESA: "tigo_pesa",
  HALOTEL: "halotel",
  CARD: "card",
} as const;

export const SELLER_COMMISSION_RATE = 0.05; // 5% platform fee
export const ESCROW_RELEASE_DAYS = 3; // Days after delivery to release payment

export const MPESA_PAYBILL = "000000"; // Replace with actual
export const AIRTEL_ACCOUNT = "SokoLink";

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};
