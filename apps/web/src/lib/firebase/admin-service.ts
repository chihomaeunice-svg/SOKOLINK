import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getCountFromServer,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { SellerProfile, Order, User } from "@/lib/types";

// ── Sellers ────────────────────────────────────────────────────────

export async function adminGetPendingSellers(): Promise<SellerProfile[]> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.SELLERS),
      where("verified", "==", false),
      orderBy("createdAt", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SellerProfile));
}

export async function adminGetAllSellers(): Promise<SellerProfile[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.SELLERS), orderBy("createdAt", "desc"), limit(100))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SellerProfile));
}

export async function adminGetSellerById(id: string): Promise<SellerProfile | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SELLERS, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as SellerProfile) : null;
}

export async function adminApproveSeller(sellerId: string) {
  await updateDoc(doc(db, COLLECTIONS.SELLERS, sellerId), {
    verified: true,
    active: true,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, COLLECTIONS.USERS, sellerId), {
    sellerVerified: true,
    updatedAt: serverTimestamp(),
  });
}

export async function adminRejectSeller(sellerId: string, reason?: string) {
  await updateDoc(doc(db, COLLECTIONS.SELLERS, sellerId), {
    verified: false,
    active: false,
    rejectedAt: serverTimestamp(),
    rejectionReason: reason ?? "",
    updatedAt: serverTimestamp(),
  });
}

export async function adminSuspendSeller(sellerId: string) {
  await updateDoc(doc(db, COLLECTIONS.SELLERS, sellerId), {
    active: false,
    suspendedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function adminReactivateSeller(sellerId: string) {
  await updateDoc(doc(db, COLLECTIONS.SELLERS, sellerId), {
    active: true,
    suspendedAt: null,
    updatedAt: serverTimestamp(),
  });
}

// ── Orders ─────────────────────────────────────────────────────────

export async function adminGetAllOrders(limitCount = 100): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.ORDERS), orderBy("createdAt", "desc"), limit(limitCount))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function adminGetOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null;
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ── Users ──────────────────────────────────────────────────────────

export async function adminGetAllUsers(limitCount = 100): Promise<User[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.USERS), orderBy("createdAt", "desc"), limit(limitCount))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as User));
}

export async function adminSuspendUser(uid: string) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    suspended: true,
    suspendedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ── Platform stats ─────────────────────────────────────────────────

export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalOrders: number;
  totalRevenue: number;
  platformFee: number;
  activeOrders: number;
}

export async function adminGetPlatformStats(): Promise<PlatformStats> {
  const [usersSnap, sellersSnap, pendingSnap, ordersSnap] = await Promise.all([
    getCountFromServer(collection(db, COLLECTIONS.USERS)),
    getCountFromServer(query(collection(db, COLLECTIONS.SELLERS), where("verified", "==", true))),
    getCountFromServer(query(collection(db, COLLECTIONS.SELLERS), where("verified", "==", false))),
    getDocs(query(collection(db, COLLECTIONS.ORDERS), orderBy("createdAt", "desc"), limit(500))),
  ]);

  const orders = ordersSnap.docs.map((d) => d.data() as Order);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "processing", "shipped"].includes(o.status)
  ).length;

  return {
    totalUsers: usersSnap.data().count,
    totalSellers: sellersSnap.data().count,
    pendingSellers: pendingSnap.data().count,
    totalOrders: ordersSnap.size,
    totalRevenue,
    platformFee: totalRevenue * 0.05,
    activeOrders,
  };
}
