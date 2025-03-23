import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [inputText, setInputText] = useState("");
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDark = colorScheme === "dark";

  // Dynamic theme colors based on system theme
  const theme = {
    background: isDark ? "#121212" : "#f7f7f7",
    text: isDark ? "#ffffff" : "#333333",
    inputBg: isDark ? "#1e1e1e" : "#ffffff",
    inputBorder: isDark ? "#333333" : "#e0e0e0",
    placeholder: isDark ? "#888888" : "#999999",
    button: isDark ? "#3b82f6" : "#2563eb",
    buttonText: "#ffffff",
    iconButton: isDark ? "#3b82f6" : "#2563eb",
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      console.log("Processing transaction:", inputText);
      // Here you would call your NLP processing function
      setInputText("");
    }
  };

  const navigateToExplore = () => {
    router.push("/explore");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Circular Graph Button */}
      <TouchableOpacity
        style={[styles.graphButton, { backgroundColor: theme.iconButton }]}
        onPress={navigateToExplore}
      >
        <Ionicons name="stats-chart" size={22} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.title, { color: theme.text }]}>Obelus</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter your transaction..."
            placeholderTextColor={theme.placeholder}
            onSubmitEditing={handleSubmit}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.button },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>
              Enter
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  graphButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 25,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 400, // More suitable for focused input
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 60,
  },
  input: {
    width: "100%",
    height: 55,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  button: {
    width: "100%",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
