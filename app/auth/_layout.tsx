import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to tabs if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)");
    }
  }, [user, loading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "#121212" : "#f7f7f7",
        },
        animation: "slide_from_right",
      }}
    />
  );
}
