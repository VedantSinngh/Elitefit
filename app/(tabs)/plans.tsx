import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const { width } = Dimensions.get("window");

export default function PlansScreen() {
  const [selectedTab, setSelectedTab] = useState("Goals");
  const tabs = ["Goals", "Run"];

  // Function to render tab-specific content
  const renderContent = () => {
    switch (selectedTab) {
      case "Goals":
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginTop: 24 }}>
            {/* Create Goals Card */}
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                shadowColor: "#007AFF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Create goals
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Set up your fitness goals
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 12,
                  width: 32,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Empty State for Goals */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 80,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#f5f5f5",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons name="calendar-outline" size={28} color="#666" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: "#1a1a1a",
                }}
              >
                No workout created!
              </Text>
              <Text
                style={{
                  color: "#666",
                  textAlign: "center",
                  paddingHorizontal: 32,
                  lineHeight: 20,
                }}
              >
                Set a workout goal to help you stay consistent with your fitness journey 💪
              </Text>
            </View>
          </ScrollView>
        );

      case "Run":
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginTop: 24 }}>
            {/* Create Run Plan Card */}
            <TouchableOpacity
              style={{
                backgroundColor: "#FF9500",
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                shadowColor: "#FF9500",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Start a Run Plan
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Plan your next running session
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 12,
                  width: 32,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="play" size={24} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Empty State for Run */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 80,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#f5f5f5",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons name="walk-outline" size={28} color="#666" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: "#1a1a1a",
                }}
              >
                No run plans yet!
              </Text>
              <Text
                style={{
                  color: "#666",
                  textAlign: "center",
                  paddingHorizontal: 32,
                  lineHeight: 20,
                }}
              >
                Create a running plan to boost your cardio and endurance 🏃‍♂️
              </Text>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header Section */}
      <View
        style={{
          paddingTop: 48,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            marginBottom: 16,
            color: "#1a1a1a",
          }}
        >
          Plans
        </Text>

        {/* Modern Tab Bar */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 8,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={{
                marginRight: 24,
                paddingBottom: 12,
                borderBottomWidth: 2,
                borderBottomColor: selectedTab === tab ? "#007AFF" : "transparent",
                minWidth: 60,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: selectedTab === tab ? "#007AFF" : "#666",
                  fontWeight: selectedTab === tab ? "600" : "500",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Render Tab-Specific Content */}
      {renderContent()}
    </View>
  );
}