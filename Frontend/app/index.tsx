import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import 'react-native-url-polyfill/auto';

const { width, height } = Dimensions.get("window");

export default function EntryScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ];

    Animated.stagger(150, animations).start();
  }, []);

  const Logo = () => (
    <Animated.View
      style={[
        tw`mb-12`,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={[tw`w-16 h-16 justify-center items-start`, { gap: 8 }]}>
        {[...Array(3)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              tw`h-2 rounded-full`,
              {
                width: width * (0.15 - index * 0.02),
                backgroundColor: "#0052FF",
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1 - index * 0.2]
                })
              }
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#F8F9FF" }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8F9FF"
        translucent={Platform.OS === 'android'}
      />
      <LinearGradient
        colors={["#0052FF", "#0039B5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          tw`absolute inset-0`,
          {
            opacity: 0.03,
            borderRadius: Platform.OS === 'ios' ? 0 : 0
          }
        ]}
      />
      <View style={tw`flex-1 justify-center items-center px-8`}>
        <Logo />
        <Animated.View
          style={[
            tw`w-full`,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          <Text
            style={[
              tw`text-4xl font-bold text-center mb-4`,
              { color: "#1A1A1A", letterSpacing: -0.5 }
            ]}
          >
            Welcome to{" "}
            <Text style={{ color: "#0052FF" }}>EliteFit</Text>
          </Text>
          <Text
            style={[
              tw`text-lg text-center`,
              { color: "#666666", lineHeight: 24 }
            ]}
          >
            Your ultimate health and{"\n"}fitness companion
          </Text>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          tw`px-8 pb-12`,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={() => router.push("/Onboarding")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            style={tw`mb-6`}
          >
            <LinearGradient
              colors={["#0052FF", "#0039B5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                tw`rounded-2xl py-4 px-6`,
                Platform.select({
                  ios: {
                    shadowColor: "#0052FF",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                  },
                  android: {
                    elevation: 8,
                  },
                }),
              ]}
            >
              <Text
                style={[
                  tw`text-center font-bold`,
                  { color: "#FFFFFF", fontSize: 18 }
                ]}
              >
                Get Started
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        <View style={tw`flex-row justify-center items-center`}>
          <Text style={[tw`text-base`, { color: "#666666" }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={tw`px-1`}
          >
            <Text
              style={[
                tw`font-bold text-base`,
                { color: "#0052FF" }
              ]}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}