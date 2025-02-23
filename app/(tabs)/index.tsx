import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getCurrentUser } from "../../lib/appwrite";
import { MotiView, AnimatePresence } from "moti";
import tw from "tailwind-react-native-classnames";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

const StatCard = ({ icon, label, value, trend }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "timing", duration: 500 }}
    style={tw`bg-white rounded-2xl p-4 flex-1 shadow-md`}
  >
    <View style={tw`flex-row items-center justify-between mb-2`}>
      <View style={tw`p-2 rounded-xl ${icon.bg}`}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={tw`flex-row items-center`}>
        <Ionicons
          name={trend >= 0 ? "arrow-up" : "arrow-down"}
          size={16}
          color={trend >= 0 ? "#10B981" : "#EF4444"}
        />
        <Text style={tw`text-xs ml-1 ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
          {Math.abs(trend)}%
        </Text>
      </View>
    </View>
    <Text style={tw`text-2xl font-bold text-gray-800`}>{value}</Text>
    <Text style={tw`text-sm text-gray-500 mt-1`}>{label}</Text>
  </MotiView>
);

const WeeklyProgressBar = ({ currentWeek, selectedDay, setSelectedDay }) => {
  const getDayAbbreviation = (date) => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  };

  const getStatusColor = (status, opacity = 1) => {
    switch (status) {
      case "complete":
        return `rgba(37, 99, 235, ${opacity})`;
      case "active":
        return `rgba(16, 185, 129, ${opacity})`;
      default:
        return `rgba(209, 213, 219, ${opacity})`;
    }
  };

  return (
    <View style={tw`bg-white rounded-2xl p-4 shadow-md mb-6`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-gray-800 text-lg font-bold`}>Weekly Progress</Text>
        <TouchableOpacity style={tw`flex-row items-center`}>
          <Text style={tw`text-blue-600 text-sm mr-1`}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`flex-row`}
      >
        {currentWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDay(day)}
            style={tw`items-center mx-2`}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                delay: index * 100,
                damping: 15,
              }}
            >
              <View
                style={[
                  tw`w-12 h-12 rounded-2xl justify-center items-center mb-2`,
                  {
                    backgroundColor: getStatusColor(day.status, 0.15),
                    borderColor: getStatusColor(day.status),
                    borderWidth: selectedDay === day ? 2 : 0,
                    transform: [{ scale: selectedDay === day ? 1.05 : 1 }],
                  },
                ]}
              >
                <Text style={tw`text-gray-800 text-lg font-semibold`}>
                  {day.day}
                </Text>
              </View>
              <Text style={tw`text-gray-500 text-xs font-medium text-center`}>
                {getDayAbbreviation(day.date)}
              </Text>
              {day.isToday && (
                <View style={tw`absolute -top-2 right-0 bg-blue-600 px-2 py-1 rounded-full`}>
                  <Text style={tw`text-white text-xs font-medium`}>Today</Text>
                </View>
              )}
            </MotiView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState([]);
  const [username, setUsername] = useState("User");
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWorkout, setShowWorkout] = useState(false); // New state for workout view

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
          status: Math.random() > 0.5 ? "complete" : "empty",
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
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            duration: 1000,
            loop: true,
          }}
        >
          <Ionicons name="fitness-outline" size={40} color="#2563EB" />
        </MotiView>
      </View>
    );
  }

  if (showWorkout) {
    return (
      <ScrollView style={tw`flex-1 bg-gray-100`} showsVerticalScrollIndicator={false}>
        <View style={tw`w-full max-w-screen-md mx-auto px-4 py-6`}>
          {/* Back Button */}
          <TouchableOpacity
            style={tw`flex-row items-center mb-6`}
            onPress={() => setShowWorkout(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#2563EB" />
            <Text style={tw`text-blue-600 text-lg font-medium ml-2`}>Back to Home</Text>
          </TouchableOpacity>

          {/* Workout Page Content */}
          <Text style={tw`text-gray-900 text-2xl font-bold mb-4`}>Workout Plan</Text>
          <View style={tw`mb-4`}>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              style={tw`bg-white rounded-2xl p-4 shadow-md mb-4`}
            >
              <Text style={tw`text-gray-800 text-lg font-semibold`}>Push-Ups</Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>3 sets of 15 reps</Text>
            </MotiView>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 100 }}
              style={tw`bg-white rounded-2xl p-4 shadow-md mb-4`}
            >
              <Text style={tw`text-gray-800 text-lg font-semibold`}>Squats</Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>3 sets of 20 reps</Text>
            </MotiView>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
              style={tw`bg-white rounded-2xl p-4 shadow-md`}
            >
              <Text style={tw`text-gray-800 text-lg font-semibold`}>Plank</Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>Hold for 1 minute</Text>
            </MotiView>
          </View>
          <TouchableOpacity style={tw`bg-blue-600 p-4 rounded-2xl shadow-md`}>
            <Text style={tw`text-white text-center text-lg font-medium`}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-gray-100`}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`w-full max-w-screen-md mx-auto px-4 py-6`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-900 text-2xl font-bold`}>Hi, {username}</Text>
              <View style={tw`ml-2 bg-blue-100 rounded-full p-1`}>
                <Ionicons name="hand-right-outline" size={20} color="#2563EB" />
              </View>
            </View>
            <Text style={tw`text-gray-500 text-sm mt-1`}>Ready to crush your goals? 💪</Text>
          </View>
          <TouchableOpacity style={tw`p-2 bg-white rounded-full shadow-sm`}>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Weekly Progress */}
        <WeeklyProgressBar
          currentWeek={currentWeek}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        {/* Action Cards */}
        <View style={tw`mb-4`}>
          <TouchableOpacity onPress={() => setShowWorkout(true)}>
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: "timing", duration: 500 }}
              style={tw`bg-gray-900 rounded-2xl p-5 shadow-lg mb-4`}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-xl font-bold mb-2`}>Workout</Text>
                  <Text style={tw`text-gray-400 text-sm`}>Start your daily exercise routine</Text>
                </View>
                <View style={tw`bg-gray-700 p-3 rounded-xl`}>
                  <Ionicons name="barbell-outline" size={24} color="white" />
                </View>
              </View>
              <View style={tw`flex-row items-center mt-4`}>
                <Text style={tw`text-white text-sm font-medium`}>Begin Now</Text>
                <Ionicons name="arrow-forward" size={16} color="white" style={tw`ml-2`} />
              </View>
            </MotiView>
          </TouchableOpacity>

          <TouchableOpacity>
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
              style={tw`bg-blue-600 rounded-2xl p-5 shadow-lg`}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white text-xl font-bold mb-2`}>AI Training Assistant</Text>
                  <Text style={tw`text-blue-100 text-sm`}>Get personalized workout recommendations</Text>
                </View>
                <View style={tw`bg-white p-3 rounded-xl`}>
                  <Ionicons name="fitness" size={24} color="#2563EB" />
                </View>
              </View>
              <View style={tw`flex-row items-center mt-4`}>
                <Text style={tw`text-white text-sm font-medium`}>Chat Now</Text>
                <Ionicons name="arrow-forward" size={16} color="white" style={tw`ml-2`} />
              </View>
            </MotiView>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}