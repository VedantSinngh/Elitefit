import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export default function NotFound() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-white px-6`}>
      {/* Error Icon */}
      <View style={tw`mb-8 bg-gray-50 rounded-full p-8`}>
        <Ionicons name="alert-circle-outline" size={64} color="#6B7280" />
      </View>

      {/* Main Error Text */}
      <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>
        Oops!
      </Text>
      <Text style={tw`text-xl font-semibold text-gray-800 mb-3`}>
        Page Not Found
      </Text>

      {/* Subtitle */}
      <Text style={tw`text-gray-500 text-center mb-8 leading-6`}>
        The page you're looking for doesn't exist or has been moved.
      </Text>

      {/* Back Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 px-8 py-4 rounded-xl flex-row items-center`}
        onPress={() => {/* Add your navigation logic here */}}
      >
        <Ionicons name="arrow-back" size={20} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white font-semibold text-base`}>
          Go Back Home
        </Text>
      </TouchableOpacity>

      {/* Additional Help Text */}
      <Text style={tw`text-gray-400 text-sm mt-8 text-center`}>
        If you need help, please contact support
      </Text>
    </View>
  );
}