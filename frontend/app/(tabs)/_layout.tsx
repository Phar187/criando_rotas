import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const HeaderIcons = () => {
  const router = useRouter();

  const handleNotificationPress = () => {
    
    console.log('Navegar para Notificações');
   
  };

  const handleSettingsPress = () => {
    
    console.log('Navegar para Configurações');
  
  };

  return (
    <View style={styles.headerContainer}>
   
      <Pressable onPress={handleNotificationPress} style={({ pressed }) => [
        styles.iconButton,
        { opacity: pressed ? 0.6 : 1 },
      ]}>
        
        <Text style={styles.iconText}>🔔</Text>
      </Pressable>


      <Pressable onPress={handleSettingsPress} style={({ pressed }) => [
        styles.iconButton,
        { opacity: pressed ? 0.6 : 1 },
      ]}>
       
        <Text style={styles.iconText}>⚙️</Text>
      </Pressable>
    </View>
  );
};



export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          
          headerShown: false,
         
          tabBarStyle: {
            display: 'none', 
            height: 0,
          },
        
          headerTitle: '',
        }}
      >

      
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mapa Principal',
            href: null, // Oculta esta tela do menu de abas inferior
            headerTitle: '', // Remove o título principal do painel de dados
            headerRight: () => <HeaderIcons />, 
          }}
        />

        

      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  
  },
  iconText: {
    fontSize: 24, 
  },
});