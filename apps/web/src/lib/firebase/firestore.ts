import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS } from "./collections";
import type { Product, Order, SellerProfile, User } from "@/lib/types";

// ── Generic helpers ────────────────────────────────────────────────

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

export async function setDocument(collectionName: string, id: string, data: DocumentData) {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocument(collectionName: string, id: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function addDocument(collectionName: string, data: DocumentData) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

// ── Products ──────────────────────────────────────────────────────

export async function getProducts(filters: {
  category?: string;
  sellerId?: string;
  featured?: boolean;
  limitCount?: number;
  lastDoc?: QueryDocumentSnapshot;
}): Promise<Product[]> {
  const constraints: QueryConstraint[] = [where("active", "==", true)];
  if (filters.category) constraints.push(where("category", "==", filters.category));
  if (filters.sellerId) constraints.push(where("sellerId", "==", filters.sellerId));
  if (filters.featured) constraints.push(where("featured", "==", true));
  constraints.push(orderBy("createdAt", "desc"));
  if (filters.lastDoc) constraints.push(startAfter(filters.lastDoc));
  constraints.push(limit(filters.limitCount ?? 20));

  const snap = await getDocs(query(collection(db, COLLECTIONS.PRODUCTS), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  return getDocument<Product>(COLLECTIONS.PRODUCTS, id);
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return addDocument(COLLECTIONS.PRODUCTS, { ...data, rating: 0, reviewCount: 0, sold: 0 });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDocument(COLLECTIONS.PRODUCTS, id, data);
}

// ── Orders ────────────────────────────────────────────────────────

export async function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  return addDocument(COLLECTIONS.ORDERS, data);
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.ORDERS),
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc"),
      limit(50)
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getOrdersBySeller(sellerId: string): Promise<Order[]> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.ORDERS),
      where("items", "array-contains-any", [{ sellerId }]),
      orderBy("createdAt", "desc"),
      limit(100)
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(orderId: string, status: string) {
  return updateDocument(COLLECTIONS.ORDERS, orderId, { status });
}

// ── Sellers ───────────────────────────────────────────────────────

export async function getSellerProfile(sellerId: string): Promise<SellerProfile | null> {
  return getDocument<SellerProfile>(COLLECTIONS.SELLERS, sellerId);
}

export async function getPendingSellers(): Promise<SellerProfile[]> {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.SELLERS), where("verified", "==", false), orderBy("createdAt", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SellerProfile));
}

export async function getAllSellers(verifiedOnly = false): Promise<SellerProfile[]> {
  const constraints: QueryConstraint[] = verifiedOnly
    ? [where("verified", "==", true), where("active", "==", true)]
    : [orderBy("createdAt", "desc")];
  const snap = await getDocs(query(collection(db, COLLECTIONS.SELLERS), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SellerProfile));
}

// ── Real-time listeners ───────────────────────────────────────────

export function listenToOrder(orderId: string, callback: (order: Order) => void): Unsubscribe {
  return onSnapshot(doc(db, COLLECTIONS.ORDERS, orderId), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() } as Order);
  });
}

export function listenToSellerOrders(sellerId: string, callback: (orders: Order[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, COLLECTIONS.ORDERS), where("sellerIds", "array-contains", sellerId), orderBy("createdAt", "desc"), limit(50)),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)))
  );
}

// ── Users ─────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<User | null> {
  return getDocument<User>(COLLECTIONS.USERS, uid);
}

export async function createUserProfile(uid: string, data: Omit<User, "id" | "createdAt">) {
  return setDoc(doc(db, COLLECTIONS.USERS, uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
