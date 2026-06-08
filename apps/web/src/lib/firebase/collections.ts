// Firestore collection names — single source of truth
export const COLLECTIONS = {
  USERS: "users",
  SELLERS: "sellers",
  PRODUCTS: "products",
  ORDERS: "orders",
  ORDER_ITEMS: "orderItems",
  PAYMENTS: "payments",
  REVIEWS: "reviews",
  NOTIFICATIONS: "notifications",
  DELIVERY_ZONES: "deliveryZones",
  CATEGORIES: "categories",
  ESCROW: "escrow",
  OTP_REQUESTS: "otpRequests",
} as const;

// Firestore document shapes
// ─────────────────────────────────────────────────────────────────
// Collection: users
// {
//   id: string (Firebase Auth UID)
//   name: string
//   phone: string           "+255xxxxxxxxx"
//   email?: string
//   role: "customer" | "seller" | "admin"
//   avatar?: string         (Firebase Storage URL)
//   fcmToken?: string       (for push notifications)
//   createdAt: Timestamp
//   updatedAt: Timestamp
// }
//
// Collection: sellers
// {
//   id: string (same as user UID)
//   userId: string
//   storeName: string
//   description: string
//   location: string        "Ilala, Dar es Salaam"
//   verified: boolean       (admin approves)
//   active: boolean
//   rating: number          (0–5)
//   totalSales: number
//   totalRevenue: number    (TZS)
//   logo?: string
//   banner?: string
//   mpesaNumber: string     "+255xxxxxxxxx"
//   airtelNumber?: string
//   idDocument?: string     (Firebase Storage URL — national ID scan)
//   createdAt: Timestamp
//   updatedAt: Timestamp
// }
//
// Collection: products
// {
//   id: string
//   sellerId: string
//   sellerName: string      (denormalized for fast reads)
//   sellerLocation: string
//   name: string
//   description: string
//   price: number           (TZS, integer)
//   compareAtPrice?: number (original price before discount)
//   category: string
//   images: string[]        (Firebase Storage URLs)
//   stock: number
//   sku?: string
//   tags: string[]
//   rating: number
//   reviewCount: number
//   sold: number
//   active: boolean
//   featured: boolean
//   createdAt: Timestamp
//   updatedAt: Timestamp
// }
//
// Collection: orders
// {
//   id: string              (auto "SL-xxxxxx")
//   customerId: string
//   customerName: string
//   customerPhone: string
//   items: [{               (embedded for fast reads)
//     productId: string
//     productName: string
//     productImage: string
//     sellerId: string
//     sellerName: string
//     quantity: number
//     price: number
//     sellerPayoutStatus: "pending" | "released" | "cancelled"
//   }]
//   status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
//   paymentMethod: "mpesa" | "airtel_money" | "cash_on_delivery"
//   paymentStatus: "pending" | "paid" | "failed" | "refunded"
//   deliveryZone: string
//   deliveryFee: number
//   deliveryAddress: {
//     street: string
//     ward: string
//     district: string
//     city: string
//     region: string
//   }
//   subtotal: number
//   total: number
//   platformFee: number     (5% of subtotal)
//   escrowReleaseAt?: Timestamp (48 hours after delivery)
//   trackingNumber?: string
//   riderName?: string
//   riderPhone?: string
//   notes?: string
//   createdAt: Timestamp
//   updatedAt: Timestamp
// }
//
// Collection: payments
// {
//   id: string
//   orderId: string
//   method: string
//   status: "pending" | "completed" | "failed" | "cancelled"
//   amount: number
//   phoneNumber: string
//   mpesaReceiptNumber?: string
//   airtelReceiptNumber?: string
//   checkoutRequestId?: string  (M-Pesa STK Push ID)
//   merchantRequestId?: string
//   resultCode?: number
//   resultDesc?: string
//   createdAt: Timestamp
//   updatedAt: Timestamp
// }
