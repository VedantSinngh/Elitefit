import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";
import { signIn, getCurrentUser, signOut } from "../../lib/appwrite";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login button pressed");
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      console.log("Validation failed: Empty fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting sign in with:", { email });
      const session = await signIn(email, password);
      console.log("Sign-in successful, session:", session);

      const currentUser = await getCurrentUser();
      console.log("Current user fetched:", currentUser);

      if (currentUser) {
        Alert.alert("Success", "Logged in successfully!");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "User not found after login.");
        console.log("No current user found after successful sign-in");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
      console.log("Login process completed");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert("Success", "Signed out successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out: " + error.message);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4`}>
        <TouchableOpacity onPress={() => {
          console.log("Back button pressed");
          router.back();
        }}>
          <Text style={tw`text-2xl p-2`}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl font-bold mb-2`}>Log in</Text>
        <Text style={tw`text-base text-gray-600 mb-8`}>Welcome back, EliteFit hero!</Text>

        <View style={tw`mb-8`}>
          <Text style={tw`text-base mb-2 text-gray-800`}>Email Address</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 text-base`}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              console.log("Email updated:", text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={tw`mb-8`}>
          <Text style={tw`text-base mb-2 text-gray-800`}>Password</Text>
          <View style={tw`flex-row items-center relative`}>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base flex-1`}
              placeholder="Enter password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                console.log("Password updated");
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={tw`absolute right-3`}
              onPress={() => {
                setShowPassword(!showPassword);
                console.log("Show password toggled");
              }}
            >
              <Text>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log("Forgot password pressed");
            router.push("/auth/forgotPassword");
          }}
          style={tw`self-end mb-8`}
        >
          <Text style={tw`text-blue-500`}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          style={tw`bg-blue-500 p-4 rounded-lg items-center mb-4 ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white text-base font-bold`}>Log in</Text>
          )}
        </TouchableOpacity>

        {/* Sign Out Button for Testing */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={tw`bg-red-500 p-4 rounded-lg items-center mb-8`}
        >
          <Text style={tw`text-white text-base font-bold`}>Sign Out (Test)</Text>
        </TouchableOpacity>

        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-600`}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              console.log("Create account pressed");
              router.push("/auth/signup");
            }}
          >
            <Text style={tw`text-blue-500`}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}