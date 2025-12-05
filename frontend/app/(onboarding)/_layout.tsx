import { Slot, usePathname, router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";

export default function OnboardingLayout() {
  const pathname = usePathname();


  const steps = [
    "(onboarding)",             
    "questionnaire-step1",
    "questionnaire-step2",
    "questionnaire-step3"
  ];


  const current = pathname.split("/").pop() || "(onboarding)";

  const currentIndex = steps.indexOf(current);
  const totalSteps = steps.length;

  const title =
    currentIndex === 0
      ? "Bem-vindo(a)"
      : `Questionário - Passo ${currentIndex}`;

  const handleBack = () => {
    if (currentIndex > 0) {
      router.back();
    }
  };

  const progressPercent = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>{"< Voltar"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* PROGRESSO */}
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>

      <Text style={styles.progressText}>
        {currentIndex + 1}/{totalSteps} concluído
      </Text>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#282b3dff" },
  header: {
    padding: 16,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#282b3dff",
    borderBottomWidth: 1,
    borderBottomColor: "#282b3dff",
    elevation: 3,
  },
  backButton: { color: "#4F46E5", fontSize: 16, fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  progressBarBackground: {
    height: 8, backgroundColor: "#e9e5ebff",
    marginHorizontal: 16, borderRadius: 4, marginTop: 6,
  },
  progressBarFill: {
    height: "100%", backgroundColor: "#ce12dfff", borderRadius: 4,
  },
  progressText: {
    textAlign: "right", color: "#6B7280",
    marginRight: 16, marginTop: 4, fontSize: 12,
  },
  content: { flex: 1, padding: 20 }
});
