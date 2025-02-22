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
import { format, addDays } from "date-fns";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const screenWidth = Dimensions.get("window").width;
const HEADER_MAX_HEIGHT = 100; // Fixed height for mobile
const HEADER_MIN_HEIGHT = 60;

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
  const [filterPeriod, setFilterPeriod] = useState("This Week");
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  // Sample data generation with realistic values
  const activityData: ActivityData[] = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(new Date(), -i),
    distance: Math.round((Math.random() * 5 + 3) * 10) / 10,
    duration: Math.round(Math.random() * 30 + 25),
    heartRate: Math.round(Math.random() * 20 + 140),
    calories: Math.round(Math.random() * 200 + 300),
    steps: Math.round(Math.random() * 3000 + 6000),
  }));

  // Animation for streak dots
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(pulse).start();
  }, []);

  const renderActivityCard = useCallback(
    ({ title, value, unit, icon, color, data, subtitle }) => (
      <TouchableOpacity
        style={styles.activityCard}
        onPress={() => setSelectedActivity(data)}
      >
        <View style={[styles.activityIcon, { backgroundColor: `${color}20` }]}>
          {icon}
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{title}</Text>
          {subtitle && <Text style={styles.activitySubtitle}>{subtitle}</Text>}
          <View style={styles.activityValueContainer}>
            <Text style={[styles.activityValue, { color }]}>{value}</Text>
            <Text style={styles.activityUnit}>{unit}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    ),
    []
  );

  const renderStreakIndicator = (day: StreakDay, index: number) => {
    const isToday =
      format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const colors = {
      complete: "#00C853",
      partial: "#FF9800",
      empty: "#E0E0E0",
    };

    return (
      <View style={styles.streakIndicatorContainer} key={index}>
        <Animated.View
          style={[
            styles.streakDot,
            {
              backgroundColor: colors[day.status] || colors.empty,
              transform: [{ scale: isToday ? pulseAnim : 1 }],
            },
          ]}
        >
          {isToday && <View style={styles.todayIndicator} />}
        </Animated.View>
        <Text style={[styles.streakDate, isToday && styles.streakDateActive]}>
          {format(day.date, "EEE")[0]}
        </Text>
      </View>
    );
  };

  const renderStreakCalendar = useCallback(
    () => (
      <Modal
        visible={showStreakCalendar}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.streakCalendarContainer}>
            <Text style={styles.streakCalendarTitle}>Streak Calendar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activityData.map((day, index) => (
                <View
                  key={index}
                  style={{ alignItems: "center", marginRight: 12 }}
                >
                  <Animated.View
                    style={[
                      styles.streakDot,
                      {
                        backgroundColor:
                          day.status === "complete"
                            ? "#00C853"
                            : day.status === "partial"
                            ? "#FF9800"
                            : "#E0E0E0",
                        transform: [
                          {
                            scale:
                              format(day.date, "yyyy-MM-dd") ===
                              format(new Date(), "yyyy-MM-dd")
                                ? pulseAnim
                                : 1,
                          },
                        ],
                      },
                    ]}
                  >
                    {format(day.date, "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd") && (
                      <View style={styles.todayIndicator} />
                    )}
                  </Animated.View>
                  <Text style={styles.streakCalendarDate}>
                    {format(day.date, "dd")}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStreakCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    ),
    [showStreakCalendar, activityData]
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "Overview":
        return (
          <>
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today’s Stats</Text>
              {renderActivityCard({
                title: "Workout",
                subtitle: "Morning Run",
                value: activityData[0].distance.toFixed(1),
                unit: "km",
                icon: <Ionicons name="walk" size={24} color="#007AFF" />,
                color: "#007AFF",
                data: activityData[0],
              })}
              {renderActivityCard({
                title: "Heart Rate",
                subtitle: "Average BPM",
                value: Math.round(activityData[0].heartRate),
                unit: "bpm",
                icon: <Ionicons name="heart" size={24} color="#FF2D55" />,
                color: "#FF2D55",
                data: activityData[0],
              })}
              {renderActivityCard({
                title: "Calories",
                subtitle: "Daily Burn",
                value: Math.round(activityData[0].calories),
                unit: "kcal",
                icon: <Ionicons name="flame" size={24} color="#FF9500" />,
                color: "#FF9500",
                data: activityData[0],
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Progress</Text>
              <LineChart
                data={{
                  labels: activityData
                    .slice()
                    .reverse()
                    .map((day) => format(day.date, "EEE")),
                  datasets: [
                    {
                      data: activityData
                        .slice()
                        .reverse()
                        .map((day) => day.distance),
                    },
                  ],
                }}
                width={screenWidth - 32}
                height={200}
                yAxisLabel=""
                yAxisSuffix=" km"
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
                }}
                bezier
                style={styles.chart}
              />
            </View> */}
          </>
        );

      case "Games":
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activity Streak</Text>
              <TouchableOpacity onPress={() => setShowStreakCalendar(true)}>
                <Text style={styles.viewAllText}>View Calendar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.streakWrapper}>
              <Text style={styles.streakSubtitle}>Keep it going! 🔥</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {activityData.map((day, index) => renderStreakIndicator(day, index))}
              </ScrollView>
            </View>
          </View>
        );

      case "Leaderboard":
        return (
          <View style={styles.section}>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Overview", "Games", "Leaderboard"].map((tab) => (
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
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() =>
              setFilterPeriod(
                filterPeriod === "This Week" ? "This Month" : "This Week"
              )
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

      {renderStreakCalendar()}

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
              <View style={styles.modalDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>
                    {format(selectedActivity.date, "PPPP")}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Distance</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.distance.toFixed(1)} km
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.duration.toFixed(0)} min
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Heart Rate</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.heartRate.toFixed(0)} bpm
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Calories</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.calories.toFixed(0)} kcal
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Steps</Text>
                  <Text style={styles.detailValue}>
                    {selectedActivity.steps.toFixed(0)}
                  </Text>
                </View>
              </View>
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
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 0 : 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  tabTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  viewAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  activitySubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
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
  streakWrapper: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },
  streakSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  streakIndicatorContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  streakDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  streakDate: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  streakDateActive: {
    color: "#007AFF",
    fontWeight: "600",
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
  chartContainer: {
    marginTop: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  streakCalendarContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  streakCalendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  streakCalendarDate: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalDetails: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});