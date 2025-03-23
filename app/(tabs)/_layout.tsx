import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        animation: "none",
        contentStyle: { flex: 1 },
      }}
    />
  );
}
