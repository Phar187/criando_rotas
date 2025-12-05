import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { getRoutes, SavedRouteStored } from '../storage/routeStorage'; 
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';


const PRIMARY_DARK = '#1a1a2e';       // Fundo principal (Muito Escuro)
const SECONDARY_DARK = '#2c2c44';     // Fundo dos cards/elementos (Menos Escuro)
const LIGHT_TEXT = '#ffffff';         // Texto principal (Branco)
const MUTED_TEXT = '#a0a0a0';         // Texto secundário (Cinza Suave)
const PURPLE_ACCENT = '#750497';      // Acento principal (Roxo)
const WARNING_ORANGE = '#FF9933';     // Acento secundário (Laranja)




type HistoryRouteParams = {
  
    onApplyRoute: (route: SavedRouteStored) => void;

    onNavigateToConfig: (route: SavedRouteStored) => void;
};

type HistoryRouteProp = RouteProp<Record<string, HistoryRouteParams>, 'history'>;


export default function HistoryScreen() {
    const navigation = useNavigation();
    const route = useRoute<HistoryRouteProp>();
    
   
    const onApplyRoute = route.params?.onApplyRoute;
    const onNavigateToConfig = route.params?.onNavigateToConfig;

    const [routes, setRoutes] = useState<SavedRouteStored[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      
        navigation.setOptions({ 
            headerTitle: 'Histórico de Rotas Salvas',
            headerBackTitle: 'Voltar',
            
        });

        const loadRoutes = async () => {
            try {
                const allRoutes = await getRoutes();
                // Opcional: Reverter para mostrar a mais recente primeiro
                setRoutes(allRoutes.reverse()); 
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar as rotas salvas.");
                console.error("Failed to load all routes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadRoutes();
    }, [navigation]);

    const handleRouteSelection = useCallback((item: SavedRouteStored) => {
        if (onApplyRoute) {
            onApplyRoute(item);
            navigation.goBack(); // Volta para o Dashboard após selecionar
        } else {
            Alert.alert("Erro de Configuração", "Função de aplicação de rota indisponível.");
        }
    }, [navigation, onApplyRoute]);

    const handleConfigSelection = useCallback((item: SavedRouteStored) => {
        if (onNavigateToConfig) {
             // Esta função deve ser responsável por navegar para a tela de configuração
             onNavigateToConfig(item); 
             navigation.goBack(); // Volta, e o navigation.navigate da função fará o restante
        } else {
            Alert.alert("Erro de Configuração", "Função de navegação para config indisponível.");
        }
    }, [navigation, onNavigateToConfig]);


    const renderItem = ({ item }: { item: SavedRouteStored }) => (
        <View style={styles.routeCard}>
            {/* 1. Clique na Linha: Aplica Rota */}
            <TouchableOpacity 
                style={styles.detailsContainer} 
                onPress={() => handleRouteSelection(item)}
            >
                <View style={styles.iconTag}>
                    <Text style={styles.iconText}>📌</Text>
                </View>
                <View style={styles.textDetails}>
                    <Text style={styles.nameText} numberOfLines={1}>
                        {item.name || "Rota Sem Nome"}
                    </Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                        {item.originAddress.split(',')[0]} ➡️ {item.destinationAddress.split(',')[0]}
                    </Text>
                    <Text style={styles.infoText}>
                        {item.distance} | {item.duration}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* 2. Clique na Seta: Abre Configurações */}
            <TouchableOpacity 
                style={styles.configButton}
                onPress={() => handleConfigSelection(item)}
            >
                <Text style={styles.configIcon}>&gt;</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color={PURPLE_ACCENT} /></View>;
    }

    if (routes.length === 0) {
  
        return <View style={styles.centerContainer}><Text style={styles.emptyText}>Nenhuma rota salva encontrada.</Text></View>;
    }

    return (
        <FlatList
            data={routes}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          
            style={styles.container} 
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    // Container Principal (Fundo Escuro)
    container: {
        flex: 1,
        backgroundColor: PRIMARY_DARK, // Fundo principal escuro
    },
    // Contêiner de Centralização (para Loading/Empty State)
    centerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: PRIMARY_DARK, 
    },
    emptyText: {
        color: MUTED_TEXT, 
        fontSize: 16,
    },
    listContainer: { 
        padding: 16, 
    },
    
    // CARD DA ROTA (routeCard)
    routeCard: {
        flexDirection: 'row',
        backgroundColor: SECONDARY_DARK, // Fundo do card mais escuro que o primário
        borderRadius: 12,
        marginBottom: 10,
        // Sombra para destaque
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#3a3a5a' // Borda sutil
    },
    detailsContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    
    // Ícone 📌 (iconTag)
    iconTag: {
        marginRight: 12,
        backgroundColor: PURPLE_ACCENT, // Usa o roxo de destaque
        borderRadius: 8,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: { 
        fontSize: 20,
        color: LIGHT_TEXT, // Ícone branco
    },
    
    // Detalhes de Texto (textDetails)
    textDetails: {
        flex: 1,
    },
    nameText: {
        fontWeight: '700',
        fontSize: 14,
        color: LIGHT_TEXT, // Texto do nome em branco
    },
    addressText: {
        fontSize: 12,
        color: MUTED_TEXT, // Endereço em cinza
    },
    infoText: {
        fontSize: 10,
        color: WARNING_ORANGE, 
        marginTop: 4,
        fontWeight: '600',
    },
    
    // Botão de Configuração (configButton)
    configButton: {
        width: 60,
        backgroundColor: PRIMARY_DARK, 
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: '#3a3a5a', // Borda escura
    },
    configIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PURPLE_ACCENT, // Ícone da seta em roxo de destaque
    }
});