import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter, useLocalSearchParams } from "expo-router";
import { account } from "../../lib/appwrite";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { userId, secret } = useLocalSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId || !secret) {
            Alert.alert("Error", "Invalid reset link.", [
                { text: "OK", onPress: () => router.push("/auth/forgotPassword") },
            ]);
        }
    }, [userId, secret]);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in both password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            await account.updateRecovery(userId, secret, newPassword, newPassword);
            Alert.alert("Success", "Password updated successfully!", [
                { text: "OK", onPress: () => router.push("/auth/login") },
            ]);
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !secret) {
        return null; // Render nothing until params are validated
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`p-4`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={tw`text-2xl p-2`}>←</Text>
                </TouchableOpacity>
            </View>
            <View style={tw`flex-1 p-4`}>
                <Text style={tw`text-2xl font-bold mb-2`}>Reset Password</Text>
                <Text style={tw`text-base text-gray-600 mb-8`}>Enter your new password below.</Text>
                <View style={tw`mb-8`}>
                    <Text style={tw`text-base mb-2 text-gray-800`}>New Password</Text>
                    <View style={tw`flex-row items-center relative`}>
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-3 text-base flex-1`}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={tw`absolute right-3`} onPress={() => setShowPassword(!showPassword)}>
                            <Text>👁️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={tw`mb-8`}>
                    <Text style={tw`text-base mb-2 text-gray-800`}>Confirm Password</Text>
                    <View style={tw`flex-row items-center relative`}>
                        <TextInput
                            style={tw`border border-gray-300 rounded-lg p-3 text-base flex-1`}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={tw`absolute right-3`} onPress={() => setShowPassword(!showPassword)}>
                            <Text>👁️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={tw`bg-blue-500 p-4 rounded-lg items-center ${loading ? "opacity-50" : ""}`}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={tw`text-white text-base font-bold`}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}