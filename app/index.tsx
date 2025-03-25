import { Redirect } from "expo-router";

// Redirect root to auth login by default
export default function Index() {
  return <Redirect href="/auth" />;
}
