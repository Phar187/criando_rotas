import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import React from "react";


const COLORS = {
  background: "#282B3D",   // Fundo Escuro da Tela
  primary: "#b90fabff",      // Roxo Vibrante para Ações
  textLight: "#F3F4F6",    // Texto Claro
  textGray: "#D1D5DB",     // Texto Cinza
  cardBg: "#374151",       // Fundo dos cards/opções
  activeOptionBg: "#9333ea", // Roxo primário para fundo da opção selecionada
  activeText: "#FFFFFF",
  disabled: "#4B5563",
};

const options = [
  "Mulher trans",
  "Mulher cis",
  "Homem cis",
  "Homem trans",
  "Prefiro não informar",
];

export default function Step2() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    // SafeAreaView para lidar com notches e barras de status
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        {/* Título da Pergunta */}
        <Text style={styles.question}>
          Como você se identifica?
        </Text>

        {/* Mapeamento das Opções */}
        <View style={styles.optionsWrapper}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.option, selected === opt && styles.optionSelected]}
              onPress={() => setSelected(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === opt && styles.optionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Próximo */}
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.disabled]}
          disabled={!selected}
          // Note: O próximo passo é step3, conforme seu código original
          onPress={() => router.push("/(onboarding)/questionnaire-step3")}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", // Centraliza o bloco de conteúdo verticalmente
    padding: 24, 
    backgroundColor: COLORS.background, 
    paddingTop: 10, // Move o conteúdo um pouco para cima
  },
  question: {
    fontSize: 22, 
    fontWeight: "bold",
    marginBottom: 80, 
    color: 'white', 
    textAlign: 'center', // Centralizado horizontalmente
    maxWidth: '100%', 
  },
  optionsWrapper: {
    gap: 14, // Espaçamento entre as opções
  },
  option: {
    padding: 18, 
    borderWidth: 2, 
    borderColor: COLORS.cardBg, 
    borderRadius: 12, 
    backgroundColor: COLORS.cardBg, 
  },
  optionSelected: {
    backgroundColor: COLORS.primary, 
    //borderColor: COLORS.primary, 
   // shadowColor: COLORS.primary,
    shadowOpacity: 0.8, 
    shadowRadius: 8, 
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textLight, 
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.activeText, 
    fontWeight: '700',
  },
  nextButton: {
    marginTop: 60, 
    backgroundColor: "#7545cfff",
    padding: 16, 
    borderRadius: 12,
    alignItems: "center",
    elevation: 6,
   // shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  disabled: {
    backgroundColor: COLORS.disabled, 
  },
  nextText: {
    color: COLORS.activeText, 
    fontSize: 18,
    fontWeight: "700",
  },
});