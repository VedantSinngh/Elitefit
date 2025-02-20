import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Animated, Dimensions, StatusBar } from "react-native";
import tw from "tailwind-react-native-classnames";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function EntryScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const Logo = () => (
    <Animated.View style={[tw`mb-8`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[tw`w-12 h-12 justify-center items-start`, { gap: 6 }]}>
        <View style={[tw`w-12 h-1.5 rounded-full`, { backgroundColor: "#0052FF" }]} />
        <View style={[tw`w-12 h-1.5 rounded-full`, { backgroundColor: "#0052FF" }]} />
        <View style={[tw`w-12 h-1.5 rounded-full`, { backgroundColor: "#0052FF" }]} />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#F8F9FF" }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      <LinearGradient
        colors={["#0052FF", "#0039B5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[tw`absolute inset-0`, { opacity: 0.05 }]}
      />
      <View style={tw`flex-1 justify-center items-center px-8`}>
        <Logo />
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: "100%" }}>
          <Text style={[tw`text-3xl font-bold text-center mb-3`, { color: "#1A1A1A" }]}>
            Welcome to EliteFit
          </Text>
          <Text style={[tw`text-lg text-center`, { color: "#666666" }]}>
            Your ultimate health and fitness tracker
          </Text>
        </Animated.View>
      </View>
      <Animated.View style={[tw`p-8`, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => router.push("/Onboarding")}
          style={[tw`mb-4`, { overflow: "hidden" }]}
        >
          <LinearGradient
            colors={["#0052FF", "#0039B5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[tw`rounded-2xl py-4 px-6`, { shadowColor: "#0052FF", elevation: 8 }]}
          >
            <Text style={[tw`text-center font-bold`, { color: "#FFFFFF", fontSize: 18 }]}>
              Get Started
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={tw`flex-row justify-center items-center`}>
          <Text style={[tw`text-base`, { color: "#666666" }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={[tw`font-bold text-base`, { color: "#0052FF" }]}>Log in</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}