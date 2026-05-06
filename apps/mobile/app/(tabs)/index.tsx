import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, FlatList, Image, Dimensions
} from "react-native";
import { Link } from "expo-router";
import { Search, Bell, ShoppingCart } from "lucide-react-native";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: "electronics", name: "Elektroniki", icon: "📱" },
  { id: "fashion", name: "Mavazi", icon: "👗" },
  { id: "food", name: "Chakula", icon: "🍎" },
  { id: "home", name: "Nyumba", icon: "🏠" },
  { id: "beauty", name: "Uzuri", icon: "💄" },
  { id: "sports", name: "Michezo", icon: "⚽" },
];

const FEATURED_PRODUCTS = [
  { id: "1", name: "Samsung Galaxy A35 5G", price: 650000, image: "https://picsum.photos/seed/phone1/300/300", seller: "Kariakoo Electronics", rating: 4.7 },
  { id: "2", name: "Kanga ya Tanzania", price: 25000, image: "https://picsum.photos/seed/kanga1/300/300", seller: "Fashion Dar", rating: 4.9 },
  { id: "3", name: "Power Bank 20000mAh", price: 55000, image: "https://picsum.photos/seed/powerbank1/300/300", seller: "Tech Kariakoo", rating: 4.5 },
  { id: "4", name: "Asali ya Asili 1kg", price: 22000, image: "https://picsum.photos/seed/honey1/300/300", seller: "Dawa za Asili", rating: 4.9 },
];

function formatPrice(price: number) {
  return `TZS ${price.toLocaleString()}`;
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Habari! 👋</Text>
          <Text style={styles.subtitle}>Karibu Soko Link</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell color="#FFFFFF" size={22} />
          </TouchableOpacity>
          <Link href="/cart" asChild>
            <TouchableOpacity style={styles.iconBtn}>
              <ShoppingCart color="#FFFFFF" size={22} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search color="#9CA3AF" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tafuta bidhaa..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Lipa M-Pesa 📱</Text>
        <Text style={styles.bannerSubtitle}>Pesa yako inalindwa hadi bidhaa yako ifike</Text>
        <TouchableOpacity style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Nunua Sasa →</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aina za Bidhaa</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} asChild>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      {/* Featured products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bidhaa Maarufu</Text>
          <Link href="/shop" asChild>
            <TouchableOpacity><Text style={styles.seeAll}>Ona Zote →</Text></TouchableOpacity>
          </Link>
        </View>
        <View style={styles.productsGrid}>
          {FEATURED_PRODUCTS.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} asChild>
              <TouchableOpacity style={styles.productCard}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.sellerName}>{product.seller}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                    <Text style={styles.productRating}>⭐ {product.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const BRAND_GREEN = "#1B4332";
const GOLD = "#f59e0b";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { backgroundColor: BRAND_GREEN, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  greeting: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  searchContainer: { backgroundColor: BRAND_GREEN, paddingHorizontal: 16, paddingBottom: 16 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: "#374151" },
  banner: { margin: 16, borderRadius: 16, backgroundColor: GOLD, padding: 20 },
  bannerTitle: { fontSize: 20, fontWeight: "800", color: "#1C1C1C" },
  bannerSubtitle: { fontSize: 13, color: "#374151", marginTop: 4, marginBottom: 12 },
  bannerBtn: { backgroundColor: BRAND_GREEN, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, alignSelf: "flex-start" },
  bannerBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 12 },
  seeAll: { color: BRAND_GREEN, fontSize: 13, fontWeight: "600" },
  categoriesRow: { marginLeft: -4 },
  categoryCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, marginRight: 10, minWidth: 80, borderWidth: 1, borderColor: "#E5E7EB" },
  categoryIcon: { fontSize: 28, marginBottom: 6 },
  categoryName: { fontSize: 11, fontWeight: "600", color: "#374151", textAlign: "center" },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  productCard: { width: (width - 44) / 2, backgroundColor: "#FFFFFF", borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB" },
  productImage: { width: "100%", height: 140, backgroundColor: "#F3F4F6" },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, fontWeight: "600", color: "#111827", lineHeight: 18 },
  sellerName: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  productFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  productPrice: { fontSize: 13, fontWeight: "800", color: BRAND_GREEN },
  productRating: { fontSize: 11, color: "#6B7280" },
});
