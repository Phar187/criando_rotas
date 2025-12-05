import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../../config/firebase';
import { saveUser } from '../storage/userStorage';
import { UserData } from '../../types';


const COLORS = {
  background: "#1F2937",   // Fundo Escuro da Tela
  cardBg: "#FFFFFF",       // Fundo Claro do Card
  primary: "#9333ea",      // Roxo Vibrante
  textDark: "#1F2937",     // Texto Escuro (dentro do card)
  textGray: "#6B7280",     // Texto Cinza (Placeholders)
  inputBorder: "#D1D5DB",  // Borda do Input
  inputBg: "#F9FAFB",      // Fundo do Input
  buttonText: "#FFFFFF",   // Texto do Botão
};

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'Senha mínima: 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData: UserData = {
        id: user.uid,
        email: user.email ?? '',
        name: user.displayName ?? null,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };
      await saveUser(userData);
      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.');
      router.replace('/login');
    } catch (err) {
      console.error(err);
      Alert.alert('Falha no registro', 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textGray}
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor={COLORS.textGray}
        />

        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar senha"
          secureTextEntry
          placeholderTextColor={COLORS.textGray}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.buttonText} />
          ) : (
            <Text style={styles.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.replace('/login')}
          activeOpacity={0.6}
        >
          <Text style={styles.linkText}>Já tem conta? Fazer Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background, // Fundo escuro
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: COLORS.cardBg, // Card claro
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.primary, // Título Roxo
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: COLORS.inputBg,
    color: COLORS.textDark,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary, // Botão Roxo
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontWeight: '700',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});