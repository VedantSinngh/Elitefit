import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";
import { signOut } from "../../lib/appwrite";

export default function LogoutScreen() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut();
            Alert.alert("Success", "Logged out successfully!");
            router.replace("/auth/login"); // Redirect to login screen
        } catch (error) {
            Alert.alert("Logout Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={tw`flex-1 justify-center items-center bg-white`}>
            <Text style={tw`text-xl font-bold mb-4`}>Are you sure you want to log out?</Text>
            <TouchableOpacity
                style={tw`bg-red-500 p-4 rounded-lg items-center ${loading ? "opacity-50" : ""}`}
                onPress={handleLogout}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text style={tw`text-white text-base font-bold`}>Log Out</Text>}
            </TouchableOpacity>
        </View>
    );
}