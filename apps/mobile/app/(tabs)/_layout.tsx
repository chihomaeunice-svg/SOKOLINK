import { Tabs } from "expo-router";
import { Chrome as Home, Search, ShoppingCart, Package, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1B4332",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerStyle: { backgroundColor: "#1B4332" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Nyumbani",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: "Soko Link 🛍️",
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Duka",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          headerTitle: "Tafuta Bidhaa",
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Kikapu",
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
          headerTitle: "Kikapu Changu",
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Maagizo",
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
          headerTitle: "Maagizo Yangu",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mimi",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: "Akaunti Yangu",
        }}
      />
    </Tabs>
  );
}
