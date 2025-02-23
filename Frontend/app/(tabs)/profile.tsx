import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Bell, Shield, Smartphone, HelpCircle, ChevronRight, LogOut, Share2, Heart, Cloud, Languages, Moon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { signOut, getCurrentUser } from "../../lib/appwrite";
import { Alert } from "react-native";

interface SettingsSectionProps { title: string; children: React.ReactNode; }
interface SettingsItemProps { icon: React.ElementType; title: string; subtitle?: string; rightElement?: React.ReactNode; onPress: () => void; }

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={{ marginBottom: 24 }}>
    <Text style={{ fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 8, paddingHorizontal: 16 }}>{title}</Text>
    <View style={{ backgroundColor: "#fff", borderRadius: 16, ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) }}>{children}</View>
  </View>
);

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, title, subtitle, rightElement, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" }}>
    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F7FA", justifyContent: "center", alignItems: "center", marginRight: 12 }}><Icon size={20} color="#007AFF" /></View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "500", color: "#1A1A1A" }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>{subtitle}</Text>}
    </View>
    {rightElement || <ChevronRight size={20} color="#666" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [username, setUsername] = useState("User"); // Default username

  // Fetch the current user's name on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log("Fetched user:", currentUser); // For debugging
        if (currentUser && currentUser.name) {
          setUsername(currentUser.name); // Use 'name' instead of 'username'
        } else {
          setUsername("User");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
        setUsername("User"); // Fallback if fetch fails
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      Alert.alert("Success", "Logged out successfully!");
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <View style={{ padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#1A1A1A" }}>Settings</Text>
      </View>
      <ScrollView>
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 16,
              marginBottom: 24,
              elevation: 4,
            }}
            onPress={() => {/* Add navigation to profile if needed */}}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#F5F7FA",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <User size={30} color="#007AFF" />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>{username}</Text>
              <Text style={{ color: "#666", marginTop: 4 }}>View Profile</Text>
            </View>
            <ChevronRight size={20} color="#666" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </View>
        {/* <SettingsSection title="APP SETTINGS">
          <SettingsItem
            icon={Bell}
            title="Notifications"
            subtitle="Manage your alerts and notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
              />
            }
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          /> */}
          {/* <SettingsItem
            icon={Moon}
            title="Dark Mode"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
              />
            }
            onPress={() => setDarkModeEnabled(!darkModeEnabled)}
          />
          <SettingsItem
            icon={Languages}
            title="Language"
            subtitle="English (US)"
            onPress={() => {}}
          />
          <SettingsItem icon={Cloud} title="Data and Storage" onPress={() => {}} />
        </SettingsSection> */}
        {/* <SettingsSection title="PRIVACY & SECURITY">
          <SettingsItem icon={Shield} title="Privacy Settings" onPress={() => {}} />
          <SettingsItem
            icon={Smartphone}
            title="Connected Devices"
            subtitle="Manage your connected devices"
            onPress={() => {}}
          />
        </SettingsSection> */}
        {/* <SettingsSection title="SUPPORT">
          <SettingsItem icon={HelpCircle} title="Help & Support" onPress={() => {}} />
          <SettingsItem icon={Share2} title="Share App" onPress={() => {}} />
          <SettingsItem icon={Heart} title="Rate Us" onPress={() => {}} />
        </SettingsSection> */}
        <View style={{ padding: 16, marginBottom: 32 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFE5E5",
              padding: 16,
              borderRadius: 16,
            }}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FF3B30" style={{ marginRight: 8 }} />
            <Text style={{ color: "#FF3B30", fontSize: 16, fontWeight: "600" }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}