import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Slot, Link, usePathname } from 'expo-router'; 
import '../../config/firebase'

const AuthNavigator = () => {
  
  const pathname = usePathname() as string; 

  // Componente interno para o botão de navegação
  const NavButton = ({ href, label, iconEmoji }: { href: string, label: string, iconEmoji: string }) => {
    
    // Compara se o caminho atual é exatamente o href do botão
    const isActive = pathname === href; 

    // Classes de estilo dinâmicas
    const textStyle = isActive ? styles.navTextActive : styles.navTextInactive;

    return (
      // O Link injeta a funcionalidade de navegação no Pressable.
      // O href é passado como objeto para maior compatibilidade com o TypeScript/Expo Router.
      <Link href={href as any} asChild> 
        <Pressable style={styles.navItem}>
          <Text style={styles.iconEmoji}>{iconEmoji}</Text>
          <Text style={[styles.navText, textStyle]}>
            {label}
          </Text>
          {/* O sublinhado visualmente indica a página ativa */}
          {isActive && <View style={styles.underline} />}
        </Pressable>
      </Link>
    );
  };

 
};


// Layout principal do grupo (auth)
export default function AuthLayout() {
  return (
    <View style={styles.fullContainer}>
        
        <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#7e2ed8ff', 
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50, 
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5', 
    marginBottom: 10,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  navItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    position: 'relative', 
    flexDirection: 'row', 
  },
  iconEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 4,
    marginLeft: 4,
  },
  navTextInactive: {
    color: '#9CA3AF', 
  },
  navTextActive: {
    color: '#4F46E5', 
  },
  underline: {
    height: 3,
    width: '100%',
    backgroundColor: '#4F46E5', 
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 0,
  }
});