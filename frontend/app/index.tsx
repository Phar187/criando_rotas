// app/index.tsx
import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function EntryPoint() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Menu de Navegação (Dev)</Text>

      {/* Abas (Tabs) */}
      <Text style={styles.sectionTitle}>Abas (Tabs)</Text>
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.button}><Text>Mapa (Home)</Text></Pressable>
      </Link>
      <Link href="/(tabs)/dashboard" asChild>
        <Pressable style={styles.button}><Text>Dashboard</Text></Pressable>
      </Link>
      <Link href="/(tabs)/settings" asChild>
        <Pressable style={styles.button}><Text>Configurações</Text></Pressable>
      </Link>

      {/* Autenticação */}
      <Text style={styles.sectionTitle}>Autenticação</Text>
      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.button}><Text>Login</Text></Pressable>
      </Link>
      <Link href="/(auth)/signin" asChild>
        <Pressable style={styles.button}><Text>SignUp</Text></Pressable>
      </Link>

      {/* Onboarding */}
      <Text style={styles.sectionTitle}>Onboarding</Text>
      <Link href="/(onboarding)" asChild>
        <Pressable style={styles.button}><Text>Questionário</Text></Pressable>
      </Link>

      {/* Outras páginas */}
      <Text style={styles.sectionTitle}>Outras páginas</Text>
      <Link href="/configurar-rota" asChild>
        <Pressable style={styles.button}><Text>Configurar Rota</Text></Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  button: { 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 8, 
    marginBottom: 10,
    alignItems: 'center'
  },
});
