import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getCurrentUser } from "../../lib/appwrite";
import { MotiView } from "moti"; // Added for animations

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

const WeeklyProgressBar = ({ currentWeek, selectedDay, setSelectedDay }) => {
  const getDayAbbreviation = (date) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  };

  const getStatusColor = (status, opacity = 1) => {
    switch (status) {
      case "complete": return `rgba(37, 99, 235, ${opacity})`;
      case "active": return `rgba(16, 185, 129, ${opacity})`;
      default: return `rgba(209, 213, 219, ${opacity})`;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Weekly Progress</Text>
      </View>
      <View style={styles.weekGrid}>
        {currentWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.dayButton,
              selectedDay === day && styles.dayButtonActive,
            ]}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "timing", duration: 300 }}
            >
              <View
                style={[
                  styles.progressCircle,
                  {
                    backgroundColor: getStatusColor(day.status, 0.2),
                    borderColor: getStatusColor(day.status),
                    borderWidth: 2,
                  }
                ]}
              >
                <View style={styles.innerCircle}>
                  <Text style={styles.dayNumber}>{day.day}</Text>
                </View>
              </View>
              <Text style={styles.dayText}>{getDayAbbreviation(day.date)}</Text>
              {day.isToday && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
              )}
            </MotiView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState([]);
  const [username, setUsername] = useState("User");
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);

    const initializeWeek = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const days = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);
        days.push({
          day: date.getDate(),
          date,
          status: Math.random() > 0.5 ? 'complete' : 'empty',
          isToday: i === dayOfWeek,
        });
      }
      setCurrentWeek(days);
      setSelectedDay(days[dayOfWeek]);
    };
    initializeWeek();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted && currentUser && currentUser.name) {
          setUsername(currentUser.name);
          setCurrentWeek((prev) =>
            prev.map((day) =>
              day.isToday ? { ...day, status: "active" } : day
            )
          );
        }
      } catch (error) {
        console.log("Failed to fetch user:", error.message);
        if (isMounted) setUsername("User");
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="fitness-outline" size={32} color="#2563EB" style={styles.loadingIcon} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Welcome back, {username}</Text>
            <Text style={styles.headerSubtitle}>Let's crush your fitness goals today!</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.buttonText}>Weekly Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonTextWhite}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Progress */}
        <WeeklyProgressBar
          currentWeek={currentWeek}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        {/* Action Cards */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCardDark}>
            <Text style={styles.actionTitle}>Create New Goal</Text>
            <Text style={styles.actionSubtitle}>Set and track your fitness milestones</Text>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Get Started →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCardBlue}>
            <Text style={styles.actionTitle}>AI Training Assistant</Text>
            <Text style={styles.actionSubtitle}>Get personalized workout recommendations</Text>
            <View style={styles.actionButtonWhite}>
              <Text style={styles.actionButtonTextBlue}>Chat Now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingIcon: {
    transform: [{ rotate: "360deg" }],
    animationDuration: "1s",
    animationIterationCount: "infinite",
  },
  contentContainer: {
    width: "100%",
    maxWidth: isDesktop ? 1200 : isTablet ? 768 : 480,
    alignSelf: "center",
    paddingHorizontal: isDesktop ? 24 : 16,
    paddingVertical: isDesktop ? 40 : 32,
  },
  header: {
    flexDirection: isTablet ? "row" : "column",
    justifyContent: "space-between",
    alignItems: isTablet ? "center" : "flex-start",
    marginBottom: isDesktop ? 40 : 32,
    gap: isTablet ? 16 : 24,
  },
  headerTitle: {
    fontSize: isDesktop ? 34 : isTablet ? 30 : 26,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: isDesktop ? 16 : 14,
    color: "#6B7280",
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: "row",
    gap: isDesktop ? 16 : 12,
    alignSelf: isTablet ? "center" : "flex-end",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: isDesktop ? 20 : 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: isDesktop ? 20 : 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: isDesktop ? 16 : 14,
    fontWeight: "500",
    color: "#374151",
  },
  buttonTextWhite: {
    fontSize: isDesktop ? 16 : 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: isDesktop ? 24 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: isDesktop ? 40 : 32,
  },
  cardHeader: {
    marginBottom: isDesktop ? 24 : 16,
  },
  cardTitle: {
    fontSize: isDesktop ? 18 : 16,
    fontWeight: "600",
    color: "#374151",
  },
  weekGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayButton: {
    width: isDesktop ? "12%" : "14%",
    alignItems: "center",
    padding: isDesktop ? 12 : 8,
    borderRadius: 12,
  },
  dayButtonActive: {
    backgroundColor: "#DBEAFE",
    transform: [{ scale: 1.05 }],
  },
  progressCircle: {
    width: isDesktop ? 40 : 32,
    height: isDesktop ? 40 : 32,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  innerCircle: {
    width: isDesktop ? 28 : 24,
    height: isDesktop ? 28 : 24,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumber: {
    fontSize: isDesktop ? 14 : 12,
    fontWeight: "500",
    color: "#374151",
  },
  dayText: {
    fontSize: isDesktop ? 12 : 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  todayBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayText: {
    fontSize: isDesktop ? 10 : 8,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  actionGrid: {
    flexDirection: isTablet ? "row" : "column",
    gap: isDesktop ? 24 : 16,
  },
  actionCardDark: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: isDesktop ? 24 : 16,
    minHeight: isTablet ? 160 : 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardBlue: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: isDesktop ? 24 : 16,
    minHeight: isTablet ? 160 : 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: isDesktop ? 20 : 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionSubtitle: {
    fontSize: isDesktop ? 14 : 12,
    color: "#D1D5DB",
    marginTop: 4,
  },
  actionButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 16,
  },
  actionButtonWhite: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 16,
  },
  actionButtonText: {
    fontSize: isDesktop ? 14 : 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  actionButtonTextBlue: {
    fontSize: isDesktop ? 14 : 12,
    fontWeight: "500",
    color: "#2563EB",
  },
});