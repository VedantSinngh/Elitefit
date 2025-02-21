import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, startOfWeek, addDays } from "date-fns";
import { LineChart, BarChart } from "react-native-chart-kit";

import { 
  Calendar, 
  Activity, 
  Award, 
  TrendingUp, 
  Heart, 
  Flame, 
  ChevronDown, 
  Share2 
} from "lucide-react-native";


interface StreakDay {
  date: Date;
  status: "complete" | "partial" | "empty";
  distance?: number;
  duration?: number;
}

interface ActivityData {
  date: Date;
  distance: number;
  duration: number;
  heartRate: number;
  calories: number;
  steps: number;
}

export default function ActivitiesScreen() {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [showStreakCalendar, setShowStreakCalendar] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("Week");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);

  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({ inputRange: [0, 120], outputRange: [120, 60], extrapolate: "clamp" });

  const activityData: ActivityData[] = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(new Date(), -i),
    distance: Math.random() * 10 + 2,
    duration: Math.random() * 60 + 20,
    heartRate: Math.random() * 40 + 120,
    calories: Math.random() * 300 + 200,
    steps: Math.random() * 5000 + 3000,
  }));

  const streakDays: StreakDay[] = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(new Date(), -i),
    status: Math.random() > 0.3 ? "complete" : Math.random() > 0.5 ? "partial" : "empty",
    distance: Math.random() * 10,
    duration: Math.random() * 60,
  }));

  const renderActivityCard = useCallback(
    ({ title, value, unit, icon, data }) => (
      <TouchableOpacity
        style={{ backgroundColor: "#F8F9FA", borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 }}
        onPress={() => setSelectedActivity(data)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>{icon}<Text style={{ fontSize: 16, fontWeight: "600", marginLeft: 8 }}>{title}</Text></View>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>{value} <Text style={{ fontSize: 14, color: "#666" }}>{unit}</Text></Text>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  const renderStreakCalendar = useCallback(
    () => (
      <Modal visible={showStreakCalendar} transparent animationType="slide" statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "80%" }}>
            <Text>Streak Calendar (TBD)</Text>
          </View>
        </View>
      </Modal>
    ),
    [showStreakCalendar]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.View style={{ height: headerHeight, backgroundColor: "#fff", padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>Activities</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => setShowFilter(true)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: 4 }}>{filterPeriod}</Text>
                <ChevronDown size={20} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity><Share2 size={24} /></TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
          {["Overview", "Leaderboard", "Challenges", "Insights"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={{ marginRight: 24, paddingBottom: 8, borderBottomWidth: selectedTab === tab ? 2 : 0, borderBottomColor: "#007AFF" }}
            >
              <Text style={{ fontSize: 16, color: selectedTab === tab ? "#007AFF" : "#666", fontWeight: selectedTab === tab ? "600" : "400" }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
      <Animated.ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })} scrollEventThrottle={16}>
        {selectedTab === "Overview" && (
          <>
            {renderActivityCard({ title: "Today's Run", value: "5.2", unit: "km", icon: <Activity size={24} color="#007AFF" />, data: activityData[0] })}
            {renderActivityCard({ title: "Heart Rate", value: "128", unit: "bpm", icon: <Heart size={24} color="#FF2D55" />, data: activityData[0] })}
            {renderActivityCard({ title: "Calories", value: "384", unit: "kcal", icon: <Flame size={24} color="#FF9500" />, data: activityData[0] })}
            <View style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>Weekly Progress</Text>
              {/* Replace recharts with a React Native chart library like react-native-chart-kit */}
            </View>
          </>
        )}
        {selectedTab === "Leaderboard" && <View style={{ marginTop: 8 }}><Text>Leaderboard (TBD)</Text></View>}
      </Animated.ScrollView>
      {renderStreakCalendar()}
      <Modal visible={!!selectedActivity} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedActivity(null)}>
        <View><Text>Activity Detail (TBD)</Text></View>
      </Modal>
    </SafeAreaView>
  );
}