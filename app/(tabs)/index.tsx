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
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  processTransaction,
  TransactionResponse,
} from "../../services/openaiService";
import { saveTransactionData } from "../../services/supabaseService";

export default function HomeScreen() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [showAssumptions, setShowAssumptions] = useState(false);
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
    assumptionsBox: isDark ? "#1e1e1e" : "#ffffff",
    assumptionsBorder: isDark ? "#333333" : "#e0e0e0",
  };

  const handleSubmit = async () => {
    if (inputText.trim()) {
      try {
        setIsLoading(true);
        setAssumptions([]);
        setShowAssumptions(false);

        // Get transaction data from OpenAI
        const result: TransactionResponse = await processTransaction(inputText);
        console.log("Transaction processed:", result);

        // Save data to Supabase
        await saveTransactionData(result.tables);

        // Show success message and assumptions
        Alert.alert(
          "Transaction Saved",
          `Successfully saved to ${result.tables.map((t) => t.name).join(", ")}`
        );

        // Set assumptions to display
        setAssumptions(result.assumptions);
        setShowAssumptions(true);

        setInputText("");
      } catch (error) {
        console.error("Error:", error);
        Alert.alert(
          "Error",
          "Failed to process transaction. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              editable={!isLoading}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.button },
                pressed && { opacity: 0.8 },
                isLoading && { opacity: 0.7 },
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                  Enter
                </Text>
              )}
            </Pressable>

            {showAssumptions && assumptions.length > 0 && (
              <View
                style={[
                  styles.assumptionsContainer,
                  {
                    backgroundColor: theme.assumptionsBox,
                    borderColor: theme.assumptionsBorder,
                  },
                ]}
              >
                <Text style={[styles.assumptionsTitle, { color: theme.text }]}>
                  AI Assumptions:
                </Text>
                {assumptions.map((assumption, index) => (
                  <Text
                    key={index}
                    style={[styles.assumptionText, { color: theme.text }]}
                  >
                    • {assumption}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 400,
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
  assumptionsContainer: {
    width: "100%",
    marginTop: 24,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  assumptionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  assumptionText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});
