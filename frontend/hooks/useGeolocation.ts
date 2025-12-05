import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coords } from '../types'; // Importa a interface Coords

/**
 * Interface para os dados retornados pelo hook de localização.
 */
export interface UseGeolocationResult {
    location: Coords | null;
    errorMsg: string | null;
    isLocationLoading: boolean;
    hasPermission: boolean;
}

/**
 * Hook personalizado para obter a localização atual do usuário.
 * Gerencia permissões, estado de carregamento e o erro.
 */
export const useGeolocation = (): UseGeolocationResult => {
    const [location, setLocation] = useState<Coords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada.');
                setHasPermission(false);
                setIsLocationLoading(false);
                return;
            }

            setHasPermission(true);

            try {
                // Obtém a localização atual com alta precisão
                let locationData = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                
                setLocation({
                    latitude: locationData.coords.latitude,
                    longitude: locationData.coords.longitude,
                });
            } catch (err) {
                console.error("Erro ao obter localização:", err);
                setErrorMsg('Não foi possível obter a localização atual.');
            } finally {
                setIsLocationLoading(false);
            }
        };

        fetchLocation();
        
        // Opcional: Monitorar mudanças de localização em tempo real
        // const subscription = Location.watchPositionAsync({ ... }, newLocation => { ... });
        // return () => { if (subscription) subscription.remove(); };

    }, []);

    return { location, errorMsg, isLocationLoading, hasPermission };
};