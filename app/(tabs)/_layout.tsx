import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { Animated, Platform, TouchableOpacity, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabButton = ({ label, icon, accessibilityState, onPress }) => {
  const focused = accessibilityState.selected;
  const insets = useSafeAreaInsets();
  const animatedValues = {
    translateY: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(1)).current,
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedValues.translateY, {
        toValue: focused ? -8 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues.scale, {
        toValue: focused ? 1.2 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: insets.bottom, minHeight: 60 }}
      activeOpacity={0.8}
    >
      <Animated.View style={{ alignItems: "center", transform: [{ translateY: animatedValues.translateY }, { scale: animatedValues.scale }] }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: focused ? "#E6EDFF" : "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name={icon} size={24} color={focused ? "#0052FF" : "#666"} />
        </View>
        {focused && (
          <Animated.Text
            style={{
              fontSize: 12,
              color: "#0052FF",
              marginTop: 4,
              fontWeight: "600",
              opacity: animatedValues.scale.interpolate({ inputRange: [1, 1.2], outputRange: [0, 1] }),
            }}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 70,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarButton: (props) => <TabButton label="Home" icon="home-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarButton: (props) => <TabButton label="Stats" icon="bar-chart-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Plans",
          tabBarButton: (props) => <TabButton label="Plans" icon="chatbubbles-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarButton: (props) => <TabButton label="Profile" icon="person-outline" {...props} />,
        }}
      />
    </Tabs>
  );
}