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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 70;
const GAME_BOX_SIZE = (width - 48) / 2; // Two boxes with spacing

interface ActivityData {
  date: Date;
  distance: number;
  duration: number;
  heartRate: number;
  calories: number;
  steps: number;
}

interface GameData {
  id: string;
  title: string;
  imagePath: string;
  redirectPath: string;
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

  // Sample activity data
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

  // Sample game data with image paths (replace with your actual paths)
  const gameData: GameData[] = [
    {
      id: "1",
      title: "Temple Run Legends",
      imagePath: require("../../assets/images/temple-run-legends.webp"),
      redirectPath: "/games/racing",
    },
    {
      id: "2",
      title: "Subway Surfer",
      imagePath: require("../../assets/images/SubwaySurfer-blog-banner-1-768x432.jpg"),
      redirectPath: "/games/puzzle",
    }
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

  const handleGamePress = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // Implement your navigation logic here (e.g., using React Navigation)
    // navigation.navigate(path);
  };

  const RenderGameBox = useCallback(
    ({ item }: { item: GameData }) => (
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 500 }}
      >
        <TouchableOpacity
          style={styles.gameBox}
          onPress={() => handleGamePress(item.redirectPath)}
        >
          <Image
            source={item.imagePath}
            style={styles.gameImage}
            resizeMode="cover"
          />
          <View style={styles.gameOverlay}>
            <Text style={styles.gameTitle}>{item.title}</Text>
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
            <Text style={styles.sectionTitle}>Your Games</Text>
            <View style={styles.gamesContainer}>
              {gameData.map((game) => (
                <RenderGameBox key={game.id} item={game} />
              ))}
            </View>
          </View>
        );
      case "Leaderboard":
        return (
          <View style={styles.streakSection}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.leaderboardPlaceholder}
            >
              <Ionicons name="trophy" size={40} color="#FFD700" />
              <Text style={styles.placeholderText}>
                Compete with friends! Leaderboard coming soon.
              </Text>
            </MotiView>
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
          <Text style={styles.headerTitle}>Activities</Text>
          <View style={styles.headerControls}>
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
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() =>
                setFilterPeriod(
                  filterPeriod === "This Week" ? "This Month" : "This Week"
                )
              }
            >
              <Text style={styles.filterText}>{filterPeriod}</Text>
              <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#F5F6F8",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 4,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabTextActive: {
    color: "#007AFF",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 6,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  gamesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gameBox: {
    width: GAME_BOX_SIZE,
    height: GAME_BOX_SIZE * 1.2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameImage: {
    width: "100%",
    height: "100%",
  },
  gameOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
  },
  gameTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
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