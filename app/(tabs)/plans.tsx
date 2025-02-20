import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function PlansScreen() {
  const [selectedTab, setSelectedTab] = useState("Goals");
  const tabs = ["Goals", "Run", "Workout", "Sleep"];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Plans</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={{ marginRight: 24 }}>
              <Text style={{ fontSize: 16, color: selectedTab === tab ? "#000" : "#666", fontWeight: selectedTab === tab ? "600" : "normal" }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginTop: 24 }}>
        <TouchableOpacity style={{ backgroundColor: "#000", borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>Create goals</Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>set up your fitness goals</Text>
          </View>
          <View style={{ backgroundColor: "#fff", borderRadius: 12, width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="add" size={20} color="#000" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <Ionicons name="calendar-outline" size={24} color="#666" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>No workout created!</Text>
          <Text style={{ color: "#666", textAlign: "center", paddingHorizontal: 32 }}>
            Set a workout goal to help you stay consistent with your fitness journey 💪
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}