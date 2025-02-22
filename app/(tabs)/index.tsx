import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getCurrentUser } from "../../lib/appwrite";

export default function HomeScreen() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState([]);
  const [username, setUsername] = useState("User"); // Initial default value
  const screenWidth = Dimensions.get("window").width;

  const recommendedWorkouts = [
    {
      id: 1,
      title: "Full Body Workout",
      duration: "30 mins",
      calories: "250",
      difficulty: "Intermediate",
      image: "https://via.placeholder.com/300",
      slug: "full-body-workout",
    },
    {
      id: 2,
      title: "Cardio Blast",
      duration: "20 mins",
      calories: "200",
      difficulty: "Beginner",
      image: "https://via.placeholder.com/300",
      slug: "cardio-blast",
    },
  ];

  const progressData = [
    { label: "June Workout", value: 20, maxValue: 100 },
    { label: "Muscle Build", value: 8, maxValue: 100 },
  ];

  // Initialize week data with current date
  useEffect(() => {
    const initializeWeek = () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
      const days = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);

        days.push({
          day: date.getDate(),
          date: date,
          status: "empty",
          isToday: i === dayOfWeek,
        });
      }
      setCurrentWeek(days);
    };

    initializeWeek();
  }, []);

  // Enhanced animation for day indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  // Fetch user and update progress after mount
  useEffect(() => {
    let isMounted = true;

    const fetchUserAndUpdateProgress = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          if (currentUser && currentUser.username) {
            setUsername(currentUser.username);
            setCurrentWeek((prev) =>
              prev.map((day) =>
                day.isToday ? { ...day, status: "active" } : day
              )
            );
          } else {
            setUsername("User");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.log("Failed to fetch user:", error.message);
          setUsername("User");
        }
      }
    };

    // Delay the fetch slightly to ensure render completes
    setTimeout(() => fetchUserAndUpdateProgress(), 0);

    return () => {
      isMounted = false;
    };
  }, []);

  const renderDayDot = (day) => {
    const dotSize = 40;
    const innerDotSize = 12;

    const getStatusColors = (status) => {
      switch (status) {
        case "complete":
          return { main: "#0052FF", secondary: "#E6EDFF" };
        case "partial":
          return { main: "#FFA500", secondary: "#FFE4B5" };
        case "active":
          return { main: "#00FF00", secondary: "#E8F5E9" };
        default:
          return { main: "#E0E0E0", secondary: "#F5F5F5" };
      }
    };

    const colors = getStatusColors(day.status);

    return (
      <Animated.View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: colors.secondary,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale: day.isToday ? pulseAnim : 1 }],
        }}
      >
        <View
          style={{
            width: innerDotSize,
            height: innerDotSize,
            borderRadius: innerDotSize / 2,
            backgroundColor: colors.main,
          }}
        />
        {day.isToday && (
          <View
            style={{
              position: "absolute",
              top: -8,
              backgroundColor: "#0052FF",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}
            >
              Today
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderWorkoutCard = (workout, index) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 20,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        key={workout.id}
        style={{
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            marginBottom: 16,
            overflow: "hidden",
            elevation: 5,
          }}
          onPress={() => router.push(`/workout/${workout.slug}`)}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: workout.image }}
              style={{ width: "100%", height: 180, resizeMode: "cover" }}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(255,255,255,0.9)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="time-outline" size={14} color="#0052FF" />
              <Text
                style={{ color: "#0052FF", fontSize: 12, fontWeight: "600" }}
              >
                {workout.duration}
              </Text>
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                marginBottom: 8,
                color: "#1A1A1A",
              }}
            >
              {workout.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons name="flame-outline" size={16} color="#FF4B4B" />
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {workout.calories} cal
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#E6EDFF",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#0052FF",
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    {workout.difficulty}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#0052FF",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}
                >
                  Start
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ProgressBox = ({ label, value, maxValue }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: value / maxValue,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, [value, maxValue]);

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#1A1A1A",
            marginBottom: 12,
          }}
        >
          {label}
        </Text>
        <View
          style={{
            height: 8,
            backgroundColor: "#F5F5F5",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: "#0052FF",
              borderRadius: 4,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#666", fontSize: 12 }}>
            {Math.round((value / maxValue) * 100)}%
          </Text>
          <Text style={{ color: "#0052FF", fontSize: 14, fontWeight: "600" }}>
            {value}/{maxValue} kg
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "600" }}>
            Hello {username},
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Week Progress View */}
        <View
          style={{
            marginTop: 24,
            backgroundColor: "#F8F9FA",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#666",
              marginBottom: 12,
            }}
          >
            Weekly Progress
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {currentWeek.map((day, index) => (
              <View key={index} style={{ alignItems: "center" }}>
                {renderDayDot(day)}
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: day.isToday ? "600" : "400",
                    color: day.isToday ? "#0052FF" : "#666",
                  }}
                >
                  {day.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#000",
              borderRadius: 16,
              padding: 16,
              height: 100,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
              Create Goal
            </Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
              set up your fitness goals
            </Text>
            <View style={{ position: "absolute", bottom: 16, right: 16 }}>
              <Ionicons name="add-circle" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#0052FF",
              borderRadius: 16,
              padding: 16,
              height: 100,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
              ElitFit AI
            </Text>
            <Text style={{ color: "#E6EDFF", fontSize: 12, marginTop: 4 }}>
              set up your fitness goals
            </Text>
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                backgroundColor: "#fff",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#0052FF", fontSize: 12 }}>Chat Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Plans Progress in Two Boxes */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}
          >
            Plans Progress
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {progressData.map((progress, index) => (
              <ProgressBox
                key={index}
                label={progress.label}
                value={progress.value}
                maxValue={progress.maxValue}
              />
            ))}
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text
            style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}
          >
            Recommended Workouts
          </Text>
          {recommendedWorkouts.map((workout, index) =>
            renderWorkoutCard(workout, index)
          )}
        </View>
      </View>
    </ScrollView>
  );
}