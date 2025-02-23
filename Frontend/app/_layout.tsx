import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { getCurrentUser } from "../lib/appwrite";
import { useRouter } from "expo-router";
import { testAccountMethods } from "../lib/appwrite";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 4000));

        // Check if user is authenticated
        const currentUser = await getCurrentUser();
        if (currentUser) {
          router.replace("/(tabs)"); // Redirect to tabs if authenticated
        } else {
          router.replace("/index"); // Redirect to entry screen if not authenticated
        }
      } catch (e) {
        console.warn("Preparation failed:", e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    testAccountMethods();
  }, []);

  if (!appIsReady) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Image
          source={require("../assets/images/splash.png")}
          style={tw`absolute w-full h-full`}
          resizeMode="cover"
        />
        <Image
          source={require("../assets/images/logo.png")}
          style={tw`w-40 h-40`}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/forgotPassword" options={{ headerShown: false }} />
      <Stack.Screen name="auth/logout" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}