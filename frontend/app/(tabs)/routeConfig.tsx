import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Coords, SavedRoute } from '../../types';
import { addRoute, SavedRoutePayload } from '../storage/routeStorage'; // Importa a função de salvar

// --- CONSTANTES DE CORES ---
const PRIMARY_DARK = '#1a1a2e';       // Fundo principal (Muito Escuro)
const SECONDARY_DARK = '#2c2c44';     // Fundo dos cards/elementos (Menos Escuro)
const LIGHT_TEXT = '#ffffff';         // Texto principal (Branco)
const MUTED_TEXT = '#a0a0a0';         // Texto secundário (Cinza Suave)
const PURPLE_ACCENT = '#750497';      // Acento principal (Seleção, Input Focus)
const WARNING_ORANGE = '#FF9933';     // Acento secundário (Detalhes, Botão Salvar)
// --- FIM CONSTANTES DE CORES ---


// Definição dos Parâmetros de Navegação
type ConfigRouteParams = {
    routeConfigure: {
        // Dados de Rota
        routeId: string; // ID temporário
        polyline: string;
        distance: number;
        duration: number;
        safetyScore?: number;
        
        // Coordenadas
        originCoords: Coords;
        destinationCoords: Coords;
        
        // Endereços (Display)
        originAddress: string;
        destinationAddress: string;

        // Callback para atualizar o estado no Dashboard (opcional, mas bom para UX)
        onSaveComplete: (savedRoute: SavedRoute) => void;
    };
};

type ConfigRouteRouteProp = RouteProp<ConfigRouteParams, 'routeConfigure'>;


export default function RouteConfigureScreen() {
    const navigation = useNavigation();
    const route = useRoute<ConfigRouteRouteProp>();
    
    const { 
        routeId, 
        polyline, 
        distance, 
        duration,
        safetyScore,
        originCoords, 
        destinationCoords, 
        originAddress, 
        destinationAddress,
        onSaveComplete,
    } = route.params; // Acesso correto ao 'routeConfigure' se estiver aninhado

    const [isLoading, setIsLoading] = useState(false);
    
    // Estados do Formulário
    const [name, setName] = useState(`Rota para ${destinationAddress.split(',')[0].trim()}`);
    const [reason, setReason] = useState('Viagem pessoal');
    const [visibility, setVisibility] = useState<"private" | "group" | "public">('private');
    const [membersEmail, setMembersEmail] = useState(''); // Emails separados por vírgula

    // Processa os emails
    const membersList = useMemo(() => {
        return membersEmail
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0 && email.includes('@'));
    }, [membersEmail]);

    // Função de Salvar a Rota
    const handleSave = useCallback(async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'O nome da rota é obrigatório.');
            return;
        }

        setIsLoading(true);

        const routePayload: SavedRoutePayload = {
            name: name.trim(), 
            
            origin: originCoords,
            destination: destinationCoords,
            originAddress: originAddress,
            destinationAddress: destinationAddress,

            polyline: polyline,
            distance: distance,
            duration: duration,
            safetyScore: safetyScore,
            
            // Dados de Configuração
            visibility: visibility,
            members: membersList,
            reason: reason,
        };

        try {
            const savedRoute = await addRoute(routePayload);

            if (savedRoute) {
                Alert.alert("Sucesso", `A rota "${savedRoute.name}" foi salva no Histórico!`);
                
                // 1. Chama o callback para o Dashboard atualizar o histórico na UI
                if (onSaveComplete) {
                    onSaveComplete(savedRoute);
                }
                
                // 2. Volta para a tela principal (Dashboard)
                navigation.goBack();
            } else {
                 Alert.alert("Erro", "Falha ao salvar a rota no storage.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Ocorreu um erro inesperado ao salvar.");
        } finally {
            setIsLoading(false);
        }
        
    }, [
        name, 
        reason, 
        visibility, 
        membersList,
        polyline, distance, duration, safetyScore,
        originCoords, destinationCoords, originAddress, destinationAddress,
        onSaveComplete, navigation
    ]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PURPLE_ACCENT} />
                <Text style={styles.loadingText}>Salvando Rota...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.header}>✨ Configurar Rota</Text>
            
            {/* Box de Resumo da Rota */}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>De: **{originAddress}**</Text>
                <Text style={styles.summaryText}>Para: **{destinationAddress}**</Text>
            </View>

            {/* Nome da Rota */}
            <Text style={styles.label}>Nome da Rota *</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Viagem para o Litoral 2026"
                placeholderTextColor={MUTED_TEXT}
            />

            {/* Propósito */}
            <Text style={styles.label}>Propósito</Text>
            <TextInput
                style={styles.input}
                value={reason}
                onChangeText={setReason}
                placeholder="Ex: Férias, Trabalho, Entrega"
                placeholderTextColor={MUTED_TEXT}
            />

            {/* Participantes */}
            <Text style={styles.label}>Participantes (Emails separados por vírgula)</Text>
            <TextInput
                style={styles.input}
                value={membersEmail}
                onChangeText={setMembersEmail}
                placeholder="email1@exemplo.com, email2@exemplo.com"
                placeholderTextColor={MUTED_TEXT}
                keyboardType="email-address"
            />
            {membersList.length > 0 && (
                <Text style={styles.helpText}>Emails prontos: {membersList.length}</Text>
            )}


            {/* Visibilidade */}
            <Text style={styles.label}>Visibilidade</Text>
            <View style={styles.visibilityContainer}>
                <TouchableOpacity
                    style={[styles.visibilityButton, visibility === 'private' && styles.selectedButton]}
                    onPress={() => setVisibility('private')}
                >
                    <Text style={[styles.visibilityText, visibility === 'private' && styles.selectedText]}>🔒 Privada</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.visibilityButton, visibility === 'group' && styles.selectedButton]}
                    onPress={() => setVisibility('group')}
                >
                    <Text style={[styles.visibilityText, visibility === 'group' && styles.selectedText]}>👥 Grupo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.visibilityButton, visibility === 'public' && styles.selectedButton]}
                    onPress={() => setVisibility('public')}
                >
                    <Text style={[styles.visibilityText, visibility === 'public' && styles.selectedText]}>🌎 Pública</Text>
                </TouchableOpacity>
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
                <Text style={styles.saveButtonText}>💾 Salvar Rota</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} /> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // --- LAYOUTS ---
    container: { 
        flex: 1, 
        backgroundColor: PRIMARY_DARK, // Fundo principal escuro
    },
    contentContainer: {
        padding: 20, 
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: PRIMARY_DARK 
    },
    loadingText: { 
        marginTop: 10, 
        fontSize: 16, 
        color: PURPLE_ACCENT 
    },
    
    // --- TEXTOS ---
    header: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: LIGHT_TEXT, // Texto claro
        marginBottom: 20 
    },
    label: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: LIGHT_TEXT, // Texto claro
        marginTop: 15, 
        marginBottom: 5 
    },
    helpText: { 
        fontSize: 12, 
        color: MUTED_TEXT, // Texto cinza suave
        marginBottom: 5, 
        paddingHorizontal: 5 
    },
    
    // --- RESUMO DA ROTA (Summary Box) ---
    summaryBox: {
        backgroundColor: SECONDARY_DARK, // Fundo secundário
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: PURPLE_ACCENT, // Destaque com o roxo
        
        // Sombra leve para destacar em fundos escuros
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 3,
    },
    summaryText: { 
        fontSize: 14, 
        color: LIGHT_TEXT, // Texto claro
        lineHeight: 20 
    },
    
    // --- INPUTS ---
    input: {
        minHeight: 44,
        borderWidth: 1,
        borderColor: SECONDARY_DARK, // Borda sutil
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: SECONDARY_DARK, // Fundo do input escuro
        color: LIGHT_TEXT, // Texto digitado claro
        
        // Para foco e digitação
        paddingVertical: 10,
        fontSize: 16,
    },
    
    // --- BOTÕES DE VISIBILIDADE (Segmented Control) ---
    visibilityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        gap: 10,
    },
    visibilityButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2, // Aumentei a borda para melhor contraste
        borderColor: SECONDARY_DARK,
        backgroundColor: PRIMARY_DARK, // Fundo escuro
    },
    selectedButton: {
        backgroundColor: PURPLE_ACCENT, // Roxo ao selecionar
        borderColor: PURPLE_ACCENT,
    },
    visibilityText: {
        color: MUTED_TEXT, // Texto cinza quando não selecionado
        fontWeight: '600',
    },
    selectedText: {
        color: LIGHT_TEXT, // Texto branco quando selecionado
    },
    
    // --- BOTÃO SALVAR ---
    saveButton: {
        backgroundColor: WARNING_ORANGE, // Laranja de destaque (aviso/ação principal)
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        
        // Sombra para o botão de ação
        shadowColor: WARNING_ORANGE,
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        color: PRIMARY_DARK, // Contraste com o laranja (Texto escuro)
        fontWeight: '800', // Aumentei o peso
        fontSize: 16,
    }
});