import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarStyle: { height: 64, paddingVertical: 8 },
        tabBarLabelStyle: { marginBottom: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mark",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="map-pin" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="view"
        options={{
          title: "View",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
