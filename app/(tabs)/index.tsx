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

const WeeklyProgressBar = ({ currentWeek }) => {
  const getDayAbbreviation = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()].substring(0, 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "#2563EB"; // bg-blue-600
      case "partial":
        return "#F59E0B"; // bg-amber-500
      case "active":
        return "#10B981"; // bg-emerald-500
      default:
        return "#D1D5DB"; // bg-gray-300
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#6B7280" }}>
          Weekly Progress
        </Text>
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#2563EB" }}>
          This Week
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {currentWeek.map((day, index) => (
          <View
            key={index}
            style={{
              alignItems: "center",
              transform: day.isToday ? [{ scale: 1.1 }] : [],
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: day.isToday ? "#DBEAFE" : "transparent",
                borderRadius: 16,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getStatusColor(day.status),
                }}
              />
              {day.isToday && (
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    backgroundColor: "#2563EB",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#fff",
                      fontWeight: "500",
                    }}
                  >
                    Today
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 12,
                color: day.isToday ? "#2563EB" : "#6B7280",
                fontWeight: day.isToday ? "600" : "400",
              }}
            >
              {getDayAbbreviation(day.date)}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: day.isToday ? "#111827" : "#9CA3AF",
                fontWeight: day.isToday ? "500" : "400",
                marginTop: 2,
              }}
            >
              {day.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState([]);
  const [username, setUsername] = useState("User");
  const screenWidth = Dimensions.get("window").width;

  // const recommendedWorkouts = [
  //   {
  //     id: 1,
  //     title: "Full Body Workout",
  //     duration: "30 mins",
  //     calories: "250",
  //     difficulty: "Intermediate",
  //     // image: "https://via.placeholder.com/400",
  //     slug: "full-body-workout",
  //   },
  //   {
  //     id: 2,
  //     title: "Cardio Blast",
  //     duration: "20 mins",
  //     calories: "200",
  //     difficulty: "Beginner",
  //     // image: "https://via.placeholder.com/400",
  //     slug: "cardio-blast",
  //   },
  // ];

  // const progressData = [
  //   { label: "June Workout", value: 20, maxValue: 100 },
  //   { label: "Muscle Build", value: 8, maxValue: 100 },
  // ];

  // Initialize week data
  useEffect(() => {
    const initializeWeek = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
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

  // Fetch user
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
    setTimeout(() => fetchUser(), 0);
    return () => {
      isMounted = false;
    };
  }, []);

  // Animation for progress bars
  // const ProgressBox = ({ label, value, maxValue }) => {
  //   const progressAnim = useRef(new Animated.Value(0)).current;

  //   useEffect(() => {
  //     Animated.timing(progressAnim, {
  //       toValue: (value / maxValue) * 100,
  //       duration: 1000,
  //       useNativeDriver: false,
  //     }).start();
  //   }, [value, maxValue]);

  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: "#fff",
  //         borderRadius: 12,
  //         padding: 16,
  //         shadowColor: "#000",
  //         shadowOffset: { width: 0, height: 2 },
  //         shadowOpacity: 0.1,
  //         shadowRadius: 4,
  //         elevation: 3,
  //       }}
  //     >
  //       <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
  //         {label}
  //       </Text>
  //       <View
  //         style={{
  //           height: 4,
  //           backgroundColor: "#E5E7EB",
  //           borderRadius: 2,
  //           overflow: "hidden",
  //         }}
  //       >
  //         <Animated.View
  //           style={{
  //             height: "100%",
  //             backgroundColor: "#2563EB",
  //             borderRadius: 2,
  //             width: progressAnim.interpolate({
  //               inputRange: [0, 100],
  //               outputRange: ["0%", "100%"],
  //             }),
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //           marginTop: 8,
  //         }}
  //       >
  //         <Text style={{ fontSize: 12, color: "#6B7280" }}>
  //           {Math.round((value / maxValue) * 100)}%
  //         </Text>
  //         <Text style={{ fontSize: 12, color: "#2563EB", fontWeight: "600" }}>
  //           {value}/{maxValue} kg
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  // Workout Card Component
  // const WorkoutCard = ({ workout }) => {
  //   const scaleAnim = useRef(new Animated.Value(1)).current;

  //   const handlePressIn = () => {
  //     Animated.spring(scaleAnim, {
  //       toValue: 1.02,
  //       friction: 5,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  //   const handlePressOut = () => {
  //     Animated.spring(scaleAnim, {
  //       toValue: 1,
  //       friction: 5,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  //   return (
  //     <Animated.View
  //       style={{
  //         transform: [{ scale: scaleAnim }],
  //         marginBottom: 24,
  //       }}
  //     >
  //       <TouchableOpacity
  //         activeOpacity={0.9}
  //         onPressIn={handlePressIn}
  //         onPressOut={handlePressOut}
  //         onPress={() => router.push(`/workout/${workout.slug}`)}
  //         style={{
  //           backgroundColor: "#fff",
  //           borderRadius: 12,
  //           overflow: "hidden",
  //           shadowColor: "#000",
  //           shadowOffset: { width: 0, height: 2 },
  //           shadowOpacity: 0.1,
  //           shadowRadius: 4,
  //           elevation: 3,
  //         }}
  //       >
  //         <View style={{ position: "relative" }}>
  //           <Image
  //             source={{ uri: workout.image }}
  //             style={{ width: "100%", height: 160, resizeMode: "cover" }}
  //           />
  //           <View
  //             style={{
  //               position: "absolute",
  //               top: 12,
  //               right: 12,
  //               backgroundColor: "rgba(255,255,255,0.9)",
  //               paddingHorizontal: 8,
  //               paddingVertical: 4,
  //               borderRadius: 16,
  //               flexDirection: "row",
  //               alignItems: "center",
  //               gap: 4,
  //             }}
  //           >
  //             <Ionicons name="time-outline" size={16} color="#2563EB" />
  //             <Text style={{ fontSize: 12, fontWeight: "600", color: "#2563EB" }}>
  //               {workout.duration}
  //             </Text>
  //           </View>
  //         </View>
  //         <View style={{ padding: 16 }}>
  //           <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
  //             {workout.title}
  //           </Text>
  //           <View
  //             style={{
  //               flexDirection: "row",
  //               justifyContent: "space-between",
  //               alignItems: "center",
  //             }}
  //           >
  //             <View style={{ flexDirection: "row", gap: 16 }}>
  //               <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
  //                 <Ionicons name="flame-outline" size={16} color="#EF4444" />
  //                 <Text style={{ fontSize: 12, color: "#6B7280" }}>
  //                   {workout.calories} cal
  //                 </Text>
  //               </View>
  //               <View
  //                 style={{
  //                   backgroundColor: "#EFF6FF",
  //                   paddingHorizontal: 8,
  //                   paddingVertical: 4,
  //                   borderRadius: 12,
  //                 }}
  //               >
  //                 <Text style={{ fontSize: 12, color: "#2563EB" }}>
  //                   {workout.difficulty}
  //                 </Text>
  //               </View>
  //             </View>
  //             <TouchableOpacity
  //               style={{
  //                 backgroundColor: "#2563EB",
  //                 paddingHorizontal: 12,
  //                 paddingVertical: 8,
  //                 borderRadius: 8,
  //                 flexDirection: "row",
  //                 alignItems: "center",
  //                 gap: 4,
  //               }}
  //             >
  //               <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
  //                 Start
  //               </Text>
  //               <Ionicons name="arrow-forward" size={16} color="#fff" />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </Animated.View>
  //   );
  // };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View style={{ maxWidth: 768, alignSelf: "center", padding: 16, paddingTop: 64 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            Hello {username},
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Progress */}
        <WeeklyProgressBar currentWeek={currentWeek} />

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 16, marginTop: 32, marginBottom: 32 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#000",
              borderRadius: 12,
              padding: 16,
              position: "relative",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}>
              Create Goal
            </Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
              Set up your fitness goals
            </Text>
            <Ionicons
              name="add"
              size={24}
              color="#fff"
              style={{ position: "absolute", bottom: 16, right: 16 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#2563EB",
              borderRadius: 12,
              padding: 16,
              position: "relative",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}>
              ElitFit AI
            </Text>
            <Text style={{ fontSize: 12, color: "#BFDBFE", marginTop: 4 }}>
              Personal AI trainer
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                backgroundColor: "#fff",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: "#2563EB", fontWeight: "600" }}>
                Chat Now
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plans Progress */}
        {/* <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 16 }}>
            Plans Progress
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {progressData.map((progress, index) => (
              <ProgressBox key={index} {...progress} />
            ))}
          </View>
        </View> */}

        {/* Recommended Workouts */}
        {/* <View>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 16 }}>
            Recommended Workouts
          </Text>
          {recommendedWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View> */}
      </View>
    </ScrollView>
  );
}