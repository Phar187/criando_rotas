// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import React from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const firstTime = true; //deve-se usar async storage aqui no futuro 

    if (firstTime) router.replace("/(onboarding)/welcome");
    else router.replace("/(auth)/login");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
