import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleResetPassword = () => {
    setShowSuccessModal(true); // Add actual API call here
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={tw`text-2xl p-2`}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl font-bold mb-2`}>Forgot Password</Text>
        <Text style={tw`text-base text-gray-600 mb-8`}>
          Check your email—we've sent you a one-time password to verify your email address.
        </Text>
        <View style={tw`mb-8`}>
          <Text style={tw`text-base mb-2 text-gray-800`}>OTP Code</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 text-base`}
            placeholder="* * * * * *"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
          />
        </View>
        <View style={tw`mb-8`}>
          <Text style={tw`text-base mb-2 text-gray-800`}>New Password</Text>
          <View style={tw`flex-row items-center relative`}>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 text-base flex-1`}
              placeholder="Enter password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={tw`absolute right-3`} onPress={() => setShowPassword(!showPassword)}>
              <Text>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`flex-row mb-8`}>
          <Text style={tw`text-gray-600`}>Code expires in 5 minutes. </Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>Resend Code</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={tw`bg-blue-500 p-4 rounded-lg items-center`} onPress={handleResetPassword}>
          <Text style={tw`text-white text-base font-bold`}>Reset Password</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center`}>
          <View style={tw`bg-white rounded-xl p-6 w-4/5 items-center`}>
            <TouchableOpacity style={tw`absolute top-4 right-4`} onPress={() => setShowSuccessModal(false)}>
              <Text style={tw`text-2xl text-gray-600`}>×</Text>
            </TouchableOpacity>
            <View style={tw`w-16 h-16 bg-blue-500 rounded-full justify-center items-center mb-4`}>
              <Text style={tw`text-white text-3xl`}>✓</Text>
            </View>
            <Text style={tw`text-xl font-bold mb-2`}>Successful</Text>
            <Text style={tw`text-base text-gray-600 text-center mb-6`}>
              Password has been updated successfully
            </Text>
            <TouchableOpacity
              style={tw`bg-blue-500 p-4 rounded-lg items-center`}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/auth/login");
              }}
            >
              <Text style={tw`text-white text-base font-bold`}>Proceed to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}