import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import React from "react";


const COLORS = {
  background: "#282B3D",   // Fundo Escuro da Tela (Solicitado)
  primary: "#853dfaff",      // Roxo Vibrante para Ações
  textLight: "#F3F4F6",    // Texto Claro
  textGray: "#D1D5DB",     // Texto Cinza
  cardBg: "#374151",       // Fundo dos cards/opções (um cinza mais escuro)
  activeOptionBg: "#9333ea", // NOVO: Roxo primário para fundo da opção selecionada
  activeText: "#FFFFFF",
  disabled: "#4B5563",
};

const options = [
  "Evitar áreas perigosas",
  "Encontrar rotas mais rápidas",
  "Compartilhar avisos",
  "Acompanhar segurança do bairro",
];

export default function Step1() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    // SafeAreaView para lidar com notches e barras de status
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        {/* Título da Pergunta */}
        <Text style={styles.question}>
          Qual é seu principal objetivo usando o SafeRoute?
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
          onPress={() => router.push("/(onboarding)/questionnaire-step2")}
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
    justifyContent: "center", 
    padding: 24, 
    backgroundColor: COLORS.background, 
    // Ajuste para mover o conteúdo um pouco para cima
    paddingTop: 10, // Diminui o padding de cima para centralizar mais alto
  },
  question: {
    fontSize: 22, 
    fontWeight: "bold",
    marginBottom: 80, 
    color: 'white', 
    textAlign: 'center', // NOVO: Centralizado horizontalmente
    maxWidth: '100%', 
  },
  optionsWrapper: {
    gap: 14, 
  },
  option: {
    padding: 18, 
    borderWidth: 2, 
    borderColor: COLORS.cardBg, 
    borderRadius: 12, 
    backgroundColor: COLORS.cardBg, 
  },
  optionSelected: {
    backgroundColor: COLORS.activeOptionBg, // NOVO: Fundo roxo primário
    borderColor: COLORS.primary, // Borda roxa
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8, // Aumenta a opacidade da sombra para destaque
    shadowRadius: 8, // Aumenta o raio da sombra
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textLight, 
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.activeText, // NOVO: Texto branco no fundo roxo
    fontWeight: '700',
  },
  nextButton: {
    marginTop: 60, 
    backgroundColor: COLORS.primary,
    padding: 16, 
    borderRadius: 12,
    alignItems: "center",
    elevation: 6,
    //shadowColor: COLORS.primary,
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