import { nanoid } from 'nanoid/non-secure';
import { SavedRoute as FullSavedRoute } from '../../types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const ROUTES_STORAGE_KEY = '@safeRoute:routes';

// O Payload da rota (dados de entrada sem ID e data de criação)
export type SavedRoutePayload = Omit<FullSavedRoute, 'id' | 'createdAt'>;

// O objeto de rota completo como armazenado (incluindo ID e data de criação)
export type SavedRouteStored = FullSavedRoute; 

/**
 * Obtém todas as rotas salvas do AsyncStorage.
 */
export const getRoutes = async (): Promise<SavedRouteStored[]> => {
    try {
        // Leitura correta usando a chave consistente
        const data = await AsyncStorage.getItem(ROUTES_STORAGE_KEY);
        if (data) {
            // Retorna todas as rotas
            return JSON.parse(data) as SavedRouteStored[];
        }
        return [];
    } catch (e) {
        console.error("Erro ao ler rotas do storage:", e);
        return [];
    }
};


export async function addRoute(route: SavedRoutePayload): Promise<SavedRouteStored | null> {
    try {
        const all = await getRoutes(); // Obtém todas as rotas existentes
        
        const newRoute: SavedRouteStored = {
            id: nanoid(), // Gera um ID único
            createdAt: Date.now(), // Marca o tempo de criação
            ...route, // Adiciona os dados de rota
        };
        
        // Adiciona a nova rota no início da lista (para que seja a mais recente)
        const updated = [newRoute, ...all]; 

        // ESCRITA CORRETA: Persiste o array atualizado no AsyncStorage
        await AsyncStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(updated));
        
        console.log(`[SafeRoute Storage] Rota ID ${newRoute.id} salva com sucesso.`);

        return newRoute;
    } catch (err) {
        console.error('[SafeRoute Storage] addRoute error:', err);
        return null;
    }
}