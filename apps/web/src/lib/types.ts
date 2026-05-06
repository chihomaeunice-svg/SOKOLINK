export type UserRole = "customer" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  location: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  logo?: string;
  banner?: string;
  mpesaNumber: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  sellerId: string;
  seller?: SellerProfile;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sku?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  sold: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  region: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: User;
  items: OrderItem[];
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryZone: string;
  deliveryFee: number;
  deliveryAddress: Address;
  subtotal: number;
  total: number;
  escrowReleaseAt?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  sellerId: string;
  quantity: number;
  price: number;
  sellerPayoutStatus: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  status: string;
  amount: number;
  mpesaReceiptNumber?: string;
  phoneNumber: string;
  transactionId?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customer?: User;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalSellers: number;
  totalCustomers: number;
  revenueByDay: { date: string; amount: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: Product; sold: number }[];
  topSellers: { seller: SellerProfile; revenue: number }[];
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating" | "popular";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: SortOption;
  search?: string;
  page?: number;
  limit?: number;
}
