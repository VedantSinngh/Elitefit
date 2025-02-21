import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";
import { signIn, getCurrentUser } from "../../lib/appwrite";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
  
    setLoading(true);
    try {
      console.log("Attempting to sign in with:", { email, password });
      const session = await signIn(email, password);
      console.log("Session after sign-in:", session);
      const currentUser = await getCurrentUser();
      console.log("Current user:", currentUser);
      if (currentUser) {
        Alert.alert("Success", "Logged in successfully!");
        router.replace("/(tabs)"); // Redirect to the main app
      } else {
        Alert.alert("Error", "User not found after login.");
      }
    } catch (error) {
      console.error("Login error details:", error);
      if (error.message.includes("is not a function")) {
        Alert.alert("Login Failed", "Appwrite SDK issue: createEmailSession is not available. Please check the SDK version or configuration.");
      } else {
        Alert.alert("Login Failed", error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4`}>
        <TouchableOpacity onPress={() => router.back()}>
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
            onChangeText={setEmail}
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
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={tw`absolute right-3`} onPress={() => setShowPassword(!showPassword)}>
              <Text>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("/auth/forgotPassword")} style={tw`self-end mb-8`}>
          <Text style={tw`text-blue-500`}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          style={tw`bg-blue-500 p-4 rounded-lg items-center mb-8 ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-base font-bold`}>Log in</Text>}
        </TouchableOpacity>

        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-600`}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={tw`text-blue-500`}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}