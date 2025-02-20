import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tw from "tailwind-react-native-classnames";
import { z } from "zod";
import { useRouter } from "expo-router";

const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match!",
  path: ["confirmPassword"],
});

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signupHandler = async () => {
    setError("");
    const validationResult = signupSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("http://YOUR_MACHINE_IP:5000/api/auth/signup", {
        fullName,
        email,
        password,
      });
      await AsyncStorage.setItem("token", data.token);
      Alert.alert("Success", "Account created successfully!");
      router.push("/(tabs)");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
        <Text style={tw`text-2xl font-bold mb-2`}>Create Account</Text>
        <Text style={tw`text-base text-gray-600 mb-8`}>Join EliteFit and start your journey!</Text>
        {error !== "" && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-8`}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={tw`bg-blue-500 p-4 rounded-lg items-center mb-8`}
          onPress={signupHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-base font-bold`}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-600`}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={tw`text-blue-500`}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}