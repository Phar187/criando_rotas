import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";


const COLORS = {
  background: "#282b3dff", // Fundo Escuro
  primary: "#9333ea",     // Roxo Vibrante
  textLight: "#F3F4F6",   // Texto Claro (Títulos/Destaques)
  textGray: "#D1D5DB",    // Texto Cinza (Corpo/Legendas)
  buttonText: "#FFFFFF",  // Texto do Botão
};

export default function OnboardingWelcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Apaura Rotas👋</Text>

      <Text style={styles.subtitle}>
        Nosso objetivo é ajudar você a se deslocar pela cidade de forma mais
        segura, com rotas atualizadas e avisos colaborativos.
      </Text>

      <Text style={styles.text}>
        Antes de começar, precisamos entender seu perfil de uso. Isso nos ajuda
        a personalizar suas recomendações e deixar sua experiência mais segura.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(onboarding)/questionnaire-step1")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background, // Fundo escuro aplicado
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary, // Título Roxo
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.textLight, // Subtítulo Claro
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  text: {
    fontSize: 15,
    color: COLORS.textGray, // Texto Cinza
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary, // Botão Roxo
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: "600",
  },
});