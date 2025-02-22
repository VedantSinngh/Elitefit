import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 90;
const HEADER_MIN_HEIGHT = 60;

interface ActivityData {
  date: Date;
  distance: number;
  duration: number;
  heartRate: number;
  calories: number;
  steps: number;
}

export default function ActivitiesScreen() {
  const [selectedTab, setSelectedTab] = useState("Games");
  const [filterPeriod, setFilterPeriod] = useState("This Week");
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  // Sample data generation with realistic values
  const activityData: ActivityData[] = [
    {
      date: new Date(),
      distance: Math.round((Math.random() * 5 + 3) * 10) / 10,
      duration: Math.round(Math.random() * 30 + 25),
      heartRate: Math.round(Math.random() * 20 + 140),
      calories: Math.round(Math.random() * 200 + 300),
      steps: Math.round(Math.random() * 3000 + 6000),
    },
  ];

  const renderActivityCard = useCallback(
    ({ title, value, unit, icon, color, data }) => (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 600 }}
        style={styles.activityCard}
      >
        <TouchableOpacity
          style={styles.activityCardContent}
          onPress={() => setSelectedActivity(data)}
        >
          <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
            {icon}
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>{title}</Text>
            <View style={styles.activityValueContainer}>
              <Text style={[styles.activityValue, { color }]}>{value}</Text>
              <Text style={styles.activityUnit}>{unit}</Text>
            </View>
          </View>
          <View style={styles.activityArrow}>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </View>
        </TouchableOpacity>
      </MotiView>
    ),
    []
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "Games":
        return (
          <View style={styles.streakSection}>
            {/* Add your game boxes here */}
          </View>
        );
      case "Leaderboard":
        return (
          <View style={styles.streakSection}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <View style={styles.leaderboardPlaceholder}>
              <Text style={styles.placeholderText}>
                Compete with friends! Leaderboard coming soon.
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerContent}>
          <View style={styles.tabContainer}>
            {["Games", "Leaderboard"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  selectedTab === tab && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
                {selectedTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() =>
              setFilterPeriod(filterPeriod === "This Week" ? "This Month" : "This Week")
            }
          >
            <Text style={styles.filterText}>{filterPeriod}</Text>
            <Ionicons name="chevron-down" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {renderContent()}
      </Animated.ScrollView>

      <Modal
        visible={!!selectedActivity}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedActivity(null)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activity Details</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedActivity(null)}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {selectedActivity && (
              <ScrollView style={styles.modalDetails}>
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 400 }}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>
                    {format(selectedActivity.date, "PPPP")}
                  </Text>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 400, delay: 100 }}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>Distance</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.distance.toFixed(1)} km
                  </Text>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 400, delay: 200 }}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.duration.toFixed(0)} min
                  </Text>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 400, delay: 300 }}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>Heart Rate</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.heartRate.toFixed(0)} bpm
                  </Text>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 400, delay: 400 }}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>Calories</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.calories.toFixed(0)} kcal
                  </Text>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 400, delay: 500 }}
                  style={styles.detailRow}
                >
                  <Text style={styles.detailLabel}>Steps</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.steps.toFixed(0)}
                  </Text>
                </MotiView>
              </ScrollView>
            )}
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 0 : 8,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: "relative",
  },
  tabButtonActive: {
    backgroundColor: "#F6F8FA",
    borderRadius: 20,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#007AFF",
    transform: [{ translateX: -2 }],
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666666",
  },
  tabTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  streakSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
  },
  activityCard: {
    marginBottom: 12,
  },
  activityCardContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  activityValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  activityValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  activityUnit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  activityArrow: {
    marginLeft: 8,
  },
  leaderboardPlaceholder: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.5,
  },
  modalCloseButton: {
    padding: 8,
    backgroundColor: "#F6F8FA",
    borderRadius: 20,
  },
  modalDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});