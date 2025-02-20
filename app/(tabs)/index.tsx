import { View, Text, TouchableOpacity, ScrollView, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [currentWeek] = useState([
    { day: 10, status: "complete" },
    { day: 11, status: "partial" },
    { day: 12, status: "active" },
    { day: 13, status: "empty" },
    { day: 14, status: "empty" },
    { day: 15, status: "empty" },
    { day: 16, status: "empty" },
  ]);

  const recommendedWorkouts = [
    { id: 1, title: "Full Body Workout", duration: "30 mins", calories: "250", difficulty: "Intermediate", image: "https://via.placeholder.com/300", slug: "full-body-workout" },
    { id: 2, title: "Cardio Blast", duration: "20 mins", calories: "200", difficulty: "Beginner", image: "https://via.placeholder.com/300", slug: "cardio-blast" },
  ];

  const renderDayDot = (status) => {
    let dotColor = "#E0E0E0";
    if (status === "complete") dotColor = "#0052FF";
    else if (status === "partial") dotColor = "#FFA500";
    else if (status === "active") dotColor = "#00FF00";
    return <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: dotColor, alignSelf: "center" }} />;
  };

  const renderWorkoutCard = (workout, index) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    Animated.spring(animatedValue, { toValue: 1, tension: 20, useNativeDriver: true }).start();

    return (
      <Animated.View key={workout.id} style={{ opacity: animatedValue, transform: [{ translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}>
        <TouchableOpacity
          style={{ backgroundColor: "#fff", borderRadius: 16, marginBottom: 16, overflow: "hidden", elevation: 5 }}
          onPress={() => router.push(`/workout/${workout.slug}`)} // Adjust this route as needed
        >
          <View style={{ position: "relative" }}>
            <Image source={{ uri: workout.image }} style={{ width: "100%", height: 180, resizeMode: "cover" }} />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80 }} />
            <View style={{ position: "absolute", top: 12, right: 12, backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="time-outline" size={14} color="#0052FF" />
              <Text style={{ color: "#0052FF", fontSize: 12, fontWeight: "600" }}>{workout.duration}</Text>
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#1A1A1A" }}>{workout.title}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="flame-outline" size={16} color="#FF4B4B" />
                  <Text style={{ color: "#666", fontSize: 14 }}>{workout.calories} cal</Text>
                </View>
                <View style={{ backgroundColor: "#E6EDFF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: "#0052FF", fontSize: 12, fontWeight: "500" }}>{workout.difficulty}</Text>
                </View>
              </View>
              <TouchableOpacity style={{ backgroundColor: "#0052FF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Start</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ProgressBar = ({ value, maxValue, label }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    Animated.timing(progressAnim, { toValue: value / maxValue, duration: 1000, useNativeDriver: false }).start();

    return (
      <View style={{ marginVertical: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 14, fontWeight: "500" }}>{label}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ color: "#0052FF", fontSize: 16, fontWeight: "600" }}>{value}</Text>
            <Text style={{ color: "#666", fontSize: 14 }}>kg</Text>
          </View>
        </View>
        <View style={{ height: 6, backgroundColor: "#F5F5F5", borderRadius: 3, overflow: "hidden" }}>
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: "#0052FF",
              borderRadius: 3,
              width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "600" }}>Hello Faith,</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24 }}>
          {currentWeek.map((day, index) => (
            <View key={index}>
              {renderDayDot(day.status)}
              <Text style={{ textAlign: "center", marginTop: 4 }}>{day.day}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#000", borderRadius: 16, padding: 16, height: 100 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>Create Goal</Text>
            <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>set up your fitness goals</Text>
            <View style={{ position: "absolute", bottom: 16, right: 16 }}>
              <Ionicons name="add-circle" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#0052FF", borderRadius: 16, padding: 16, height: 100 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>ElitFit AI</Text>
            <Text style={{ color: "#E6EDFF", fontSize: 12, marginTop: 4 }}>set up your fitness goals</Text>
            <TouchableOpacity style={{ position: "absolute", bottom: 16, right: 16, backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ color: "#0052FF", fontSize: 12 }}>Chat Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Plans progress</Text>
          <ProgressBar label="June workout" value={20} maxValue={100} />
          <ProgressBar label="Muscle build" value={8} maxValue={100} />
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Recommended Workouts</Text>
          {recommendedWorkouts.map((workout, index) => renderWorkoutCard(workout, index))}
        </View>
      </View>
    </ScrollView>
  );
}