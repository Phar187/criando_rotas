import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  FlatList,
  Platform,
  Alert,
  Modal, 
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import MapView, { Marker, Polyline, Region, PROVIDER_GOOGLE, } from 'react-native-maps';
import * as Location from 'expo-location';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


import ChuvaIcon from '../../assets/images/chuva.png'; 
import Vazio from '../../assets/images/vazio.png'; 
import Assalto from '../../assets/images/assalto.png'; 
import Rotac from '../../assets/images/rotac.png'; 
import Tiros from '../../assets/images/tiro.png'; 



export interface Coords {
    latitude: number;
    longitude: number;
}

export interface CommunityMarker {
    id: number; 
    lat: number;
    lng: number;
    tag: string;
    icon: string | ImageSourcePropType;
    time: string; 
    description: string;
    isSimulated: boolean; 
}

interface TagData {
    tag: string;
    icon: string | ImageSourcePropType;
    desc: string;
}

// Importações dos Hooks e Storage
import { useGeolocation } from '../../hooks/useGeolocation';
import { useRouteFinder } from '../../hooks/useRouterFinder'; 
import { getRoutes, addRoute, SavedRouteStored, SavedRoutePayload } from '../storage/routeStorage'; 

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = Math.min(520, SCREEN_HEIGHT * 0.82);
const LONG_PRESS_DURATION = 1000; // 1 segundo para ativar o SOS

// --- DEFINIÇÕES DE CORES DO TEMA ---
const PRIMARY_DARK = '#121212';
const SECONDARY_DARK = '#1e1e1e';
const PURPLE_ACCENT = '#9333ea';
const LIGHT_TEXT = '#F5F5F5';
const MUTED_TEXT = '#A0A0A0';
const WARNING_ORANGE = '#f91693ff';
const ERROR_RED = '#2d1f6bff';
const GPS_GREEN = '#472272c5';



const DARK_MONOCHROME_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  // Labels em cor clara (quase branca) para contraste
  { elementType: 'labels.text.fill', stylers: [{ color: '#E0E0E0' }] }, 
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#404040' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#E0E0E0' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#E0E0E0' }] },
  
  // Pontos de Interesse (POIs) - Texto claro com acento roxo
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#9333ea' }] }, 
  
  // --- ESTILOS DE VEGETAÇÃO (TONALIDADES DE ROXO ESCURO E SUAVE) ---
  
  // Paisagem Natural (Vegetação Geral) em Roxo Escuro Suave
  { 
      featureType: 'landscape.natural', 
      elementType: 'geometry', 
      
      stylers: [{ color: '#2C2A33' }] 
  },
  
  // Parques em uma tonalidade ligeiramente diferente, mantendo o padrão escuro
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#33313A' }] }, 
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#C0C0C0' }] },
  { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  
  // --- RUAS E RODOVIAS (CINZA ESCURO C/ TOQUE ROXO IMPERCEPTÍVEL) ---
  
  // Ruas e Vias Locais: Cinza escuro com toque roxo imperceptível
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#167f86ff' }] }, 
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#B0B0B0' }] },
  
  // Ruas Arteriais, Rodovias e Vias Principais: A mesma cor para uniformidade
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#29292D' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#29292D' }] },
  
  // Vias de Acesso Controlado
  { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#303035' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#909090' }] },
  
  // --- CORPOS D'ÁGUA (PRETO MAIS ESCURO C/ LEVE TOQUE AZUL) ---
  { 
      featureType: 'water', 
      elementType: 'geometry', 
      // Preto muito escuro com leve toque azul: #252528
      stylers: [{ color: '#c43c3cff' }] 
  },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#5A5A6B' }] },
  
  // --- FIM DOS ESTILOS ESPECÍFICOS ---

  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
  
  // Desligar ícones desnecessários
  { featureType: 'poi.business', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] }
];


/** ---------- CONSTANTES DE SIMULAÇÃO E UTILITÁRIOS ---------- **/

const SIMULATION_TAGS: TagData[] = [
    { tag: 'Assalto', icon: Assalto, desc: 'Suspeita de assalto na área.' },
    { tag: 'Sons de Tiro', icon: Tiros, desc: 'Barulhos de tiro ouvidos recentemente.' },
    { tag: 'Aviso de Rota Comprometida', icon: Rotac, desc: 'Rota com alto índice de alertas recentes.' },
    { tag: 'Rua Vazia', icon: Vazio, desc: 'Baixo movimento na rua.' },
    { tag: 'Chuva ou Terreno Complexo', icon: ChuvaIcon, desc: 'Rua com buracos ou desníveis.' }
];

const createRandomPoint = (baseLat: number, baseLng: number, maxDistanceKm: number = 2): Coords => {
    const EARTH_RADIUS_KM = 6371;
    const maxRad = maxDistanceKm / EARTH_RADIUS_KM; 

    const randomAngle = Math.random() * 2 * Math.PI;
    const randomDist = Math.random() * maxRad; 

    const latRad = baseLat * (Math.PI / 180);
    const lngRad = baseLng * (Math.PI / 180);

    const newLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(randomDist) +
        Math.cos(latRad) * Math.sin(randomDist) * Math.cos(randomAngle)
    );
    const newLngRad = lngRad + Math.atan2(
        Math.sin(randomAngle) * Math.sin(randomDist) * Math.cos(latRad),
        Math.cos(randomDist) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    return {
        latitude: newLatRad * (180 / Math.PI),
        longitude: newLngRad * (180 / Math.PI)
    };
};

const generateSimulatedWarnings = (baseLocation: Coords): CommunityMarker[] => {
    if (!baseLocation) return [];

    const warnings: CommunityMarker[] = [];
    const now = new Date().toLocaleTimeString('pt-BR');

    for (let i = 0; i < SIMULATION_TAGS.length; i++) {
        const { latitude, longitude } = createRandomPoint(baseLocation.latitude, baseLocation.longitude, 1.5); 
        const tagData = SIMULATION_TAGS[i];
        
        warnings.push({
            id: Date.now() + i, 
            tag: tagData.tag,
            icon: tagData.icon,
            time: now,
            description: tagData.desc, 
            lat: latitude,
            lng: longitude,
            isSimulated: true, 
        });
    }
    return warnings;
};


// --- Funções Auxiliares de Rota (Decodificação e Geocodificação) ---

const decodePolyline = (encoded?: string | null): Coords[] => {
  if (!encoded || typeof encoded !== 'string' || encoded.length === 0) return [];
  const points: Coords[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b = 0;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
};

const geocodeAddress = async (address: string): Promise<Coords | null> => {
  try {
    if (!address || address.length < 3) return null;
    const results = await Location.geocodeAsync(address);
    if (results && results.length > 0) {
      const { latitude, longitude } = results[0] as any;
      return { latitude, longitude };
    }
    return null;
  } catch (err) {
    console.error('geocode error', err);
    return null;
  }
};


/** ----------------------------------------
 * ---------- COMPONENTE PRINCIPAL ---------- 
 * ---------------------------------------- **/

export default function Dashboard() {
  const navigation = useNavigation<any>();

  // --- HOOKS E ESTADO ---
  const { location: gpsLocation, isLocationLoading, errorMsg: locationError } = useGeolocation();
  const { routeData, isLoading: routeLoading, error: routeError, findRoute } = useRouteFinder();

  const mapRef = useRef<MapView | null>(null); 

  // Form + Route State
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');

  const [originCoords, setOriginCoords] = useState<Coords | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coords | null>(null);

  const [isOriginInputText, setIsOriginInputText] = useState(false);
  const [isDestinationInputText, setIsDestinationInputText] = useState(true);

  const [searchError, setSearchError] = useState<string | null>(null);

  // Markers & Previous Routes
  const [userMarkers, setUserMarkers] = useState<CommunityMarker[]>([]); 
  const [simulatedWarnings, setSimulatedWarnings] = useState<CommunityMarker[]>([]); 
  const [previousRoutes, setPreviousRoutes] = useState<SavedRouteStored[]>([]); 

  // Drawn polyline coords (after confirm)
  const [polylineCoords, setPolylineCoords] = useState<Coords[] | null>(null);

  // Auxiliary
  const [isProcessingRoute, setIsProcessingRoute] = useState(false);

  // ESTADO: MODO NAVEGAÇÃO
  const [isRouteActive, setIsRouteActive] = useState(false);

  // Bottom Sheet State & Animation
  const sheetTranslateY = useSharedValue(SHEET_HEIGHT);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showRouteActions, setShowRouteActions] = useState(false); 

  // Map Region
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // ESTADO DO NOVO MODAL DE AVISO COMUNITÁRIO
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedWarningTag, setSelectedWarningTag] = useState<TagData | null>(null);
  const [warningAddressInput, setWarningAddressInput] = useState('');
  const [isWarningProcessing, setIsWarningProcessing] = useState(false);


  /** ---------- Handlers de UI e Animação ---------- **/

  const sheetStyle = useAnimatedStyle(() => {
    const t = sheetTranslateY.value;
    const radius = interpolate(t, [0, SHEET_HEIGHT], [14, 0]);
    return {
      transform: [{ translateY: t }],
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const o = interpolate(sheetTranslateY.value, [0, SHEET_HEIGHT], [0.45, 0]);
    return { opacity: o };
  });

  const finishClosingSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const resetUIState = useCallback(() => {
      setPolylineCoords(null);
      setShowRouteActions(false); 
      setDestinationAddress('');
      setDestinationCoords(null);
      setSearchError(null);
      setIsProcessingRoute(false);
      
      if (gpsLocation) {
        setOriginCoords(gpsLocation);
        setOriginAddress('Localização Atual (GPS)');
        setIsOriginInputText(false); 
      } else {
        setOriginCoords(null);
        setOriginAddress('');
      }
  }, [gpsLocation]);

  const openSheet = useCallback(() => {
    if (isRouteActive) return;

    if (!showRouteActions) {
        resetUIState();
    }
    
    setIsSheetOpen(true);
    sheetTranslateY.value = withTiming(0, { duration: 300 });
  }, [isRouteActive, resetUIState, showRouteActions, sheetTranslateY]);

  const closeSheet = useCallback(() => {
    sheetTranslateY.value = withTiming(SHEET_HEIGHT, { duration: 240 }, (finished) => {
      if (finished) {
        runOnJS(finishClosingSheet)();
      }
    });
  }, [finishClosingSheet, sheetTranslateY]);

  const onGestureEvent = () => {
    // No-op para PanGestureHandler
  };


  /** ---------- Efeitos e Ciclo de Vida ---------- **/

  useEffect(() => {
    async function loadRoutes() {
        try {
            const routes = await getRoutes();
            setPreviousRoutes(routes.slice(0, 10)); 
        } catch (e) {
            console.error("Failed to load saved routes:", e);
        }
    }
    loadRoutes();
  }, []);

  useEffect(() => {
    if (routeData && (routeData as any).polyline) { 
      const decoded = decodePolyline((routeData as any).polyline);
      
      if (decoded.length > 0) {
        setPolylineCoords(decoded);
        setShowRouteActions(true); 
        setSearchError(null);

        if (mapRef.current) {
            mapRef.current.fitToCoordinates(decoded, { 
                edgePadding: { top: 50, right: 50, bottom: SHEET_HEIGHT + 50, left: 50 },
                animated: true 
            });
        }
      } else {
        setSearchError("Não foi possível traçar a rota.");
      }
    }
  }, [routeData]); 

  useEffect(() => {
    if (gpsLocation && !isOriginInputText && !isRouteActive && !originCoords) {
      setOriginCoords(gpsLocation);
      setOriginAddress('Localização Atual (GPS)');
      setMapRegion(prev => ({ ...prev, latitude: gpsLocation.latitude, longitude: gpsLocation.longitude }));
    }
  }, [gpsLocation, isOriginInputText, isRouteActive, originCoords]);


  useEffect(() => {
    // Carrega avisos simulados quando o GPS está disponível
    if (gpsLocation) {
        const simulated = generateSimulatedWarnings(gpsLocation);
        setSimulatedWarnings(simulated);
    }
  }, [gpsLocation]);


  /** -------------------------------------------
   * ---------- AÇÕES DE NAVEGAÇÃO E ROTA ---------- 
   * ------------------------------------------- **/

  const handleSaveRouteComplete = useCallback((route: any /* Deve ser SavedRoute */) => { 
    setPreviousRoutes(prev => [route, ...prev].slice(0, 10) as SavedRouteStored[]);
    setPolylineCoords(null); 
    setShowRouteActions(false);
  }, []);


  const handleUseGPSAsOrigin = useCallback(() => {
    if (showRouteActions) return; 

    if (gpsLocation) {
      setOriginAddress('Localização Atual (GPS)');
      setOriginCoords(gpsLocation);
      setIsOriginInputText(false);
      setSearchError(null);
      setMapRegion(prev => ({ ...prev, latitude: gpsLocation.latitude, longitude: gpsLocation.longitude }));
    } else {
      setSearchError('Aguardando permissão de GPS...');
    }
  }, [gpsLocation, showRouteActions]);

  const handleConfirmTrajectory = useCallback(async () => {
    Keyboard.dismiss();
    setSearchError(null);
    setIsProcessingRoute(true);

    try {
      let finalOrigin = originCoords; 
      let finalDestination = destinationCoords;

      // Geocodificação da Origem (se não for GPS)
      if (isOriginInputText && originAddress && originAddress.length > 3 && originAddress !== 'Localização Atual (GPS)') {
        setSearchError('Geocodificando origem...');
        const g = await geocodeAddress(originAddress);
        if (!g) {
          setSearchError('Origem não encontrada. Tente outro endereço.');
          setIsProcessingRoute(false);
          return;
        }
        finalOrigin = g;
        setOriginCoords(g);
      }

      // Geocodificação do Destino
      if (isDestinationInputText && destinationAddress && destinationAddress.length > 3) {
        setSearchError('Geocodificando destino...');
        const g = await geocodeAddress(destinationAddress);
        if (!g) {
          setSearchError('Destino não encontrada. Tente outro endereço.');
          setIsProcessingRoute(false);
          return;
        }
        finalDestination = g;
        setDestinationCoords(g);
      }

      if (!finalOrigin || !finalDestination) {
        setSearchError('Defina origem e destino.');
        setIsProcessingRoute(false);
        return;
      }

      await findRoute(finalOrigin, finalDestination);
      
    } catch (err) {
      console.error('Erro ao calcular:', err);
      setSearchError('Erro ao buscar rota.');
    } finally {
      setIsProcessingRoute(false);
    }
  }, [
    originCoords, destinationCoords, originAddress, destinationAddress, 
    isOriginInputText, isDestinationInputText, findRoute
  ]);

  const handleCreateAndStartRoute = useCallback(() => {
    const data = routeData as any;

    if (!polylineCoords || polylineCoords.length === 0 || !data || !originCoords || !destinationCoords) {
        setSearchError('Aguarde o carregamento da rota...');
        return;
    }

    let distanceValue: number;
    if (typeof data.distance === 'string') {
        const cleaned = data.distance.replace(/[^\d.,]/g, '').replace(',', '.');
        distanceValue = parseFloat(cleaned) || 0; 
    } else if (typeof data.distance === 'number') {
        distanceValue = data.distance;
    } else {
        distanceValue = 0; 
    }

    // Cria o payload para salvamento rápido
    const quickSavePayload: SavedRoutePayload = {
        name: `Rota Rápida: ${destinationAddress.split(',')[0]}`,
        origin: originCoords,
        destination: destinationCoords,
        originAddress: originAddress,
        destinationAddress: destinationAddress,

        polyline: data.polyline,
        distance: distanceValue,
        duration: data.duration,
        safetyScore: data.safetyScore,

        visibility: 'private',
        members: [],
        reason: 'Início Rápido',
    };

    // Salva a rota no storage
    addRoute(quickSavePayload).then((saved) => {
        if (saved) {
             setPreviousRoutes(prev => [saved, ...prev].slice(0, 10) as SavedRouteStored[]);
        }
    });
    
    closeSheet();
    setIsRouteActive(true); // Ativa o modo navegação
    
  }, [
    polylineCoords, routeData, originCoords, destinationCoords, originAddress, destinationAddress, closeSheet
  ]);


  const handleConfigureRoute = useCallback(() => {
    const data = routeData as any;

    if (
        !polylineCoords || polylineCoords.length === 0 || !originCoords || !destinationCoords || 
        !data || !data.polyline || !data.distance
    ) {
        Alert.alert('Erro', 'Rota inválida. Calcule o trajeto antes de configurar.');
        return;
    }

    // Navega para a tela de Configuração
    navigation.navigate('routeConfig', {
        polyline: data.polyline,
        distance: data.distance,
        duration: data.duration,
        safetyScore: data.safetyScore,
        
        originCoords: originCoords,
        destinationCoords: destinationCoords,
        
        originAddress: originAddress,
        destinationAddress: destinationAddress,
        
        onSaveComplete: handleSaveRouteComplete,
    });
    
    closeSheet(); 
    
  }, [
    polylineCoords, originCoords, destinationCoords, originAddress, destinationAddress, 
    routeData, navigation, closeSheet, handleSaveRouteComplete 
  ]);

  const handleFinalizeRoute = useCallback(() => {
    Alert.alert(
        "Finalizar Rota",
        "Deseja encerrar a navegação atual? Isso limpará a linha do mapa.",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Sim, Finalizar", 
                style: "destructive",
                onPress: () => {
                    setIsRouteActive(false);
                    resetUIState();
                }
            }
        ]
    );
  }, [resetUIState]);
  
  const applyPreviousRoute = useCallback((route: SavedRouteStored) => {
    if (isRouteActive) return;

    resetUIState();

    setTimeout(() => {
        const decoded = decodePolyline(route.polyline);
        
        if (decoded && decoded.length > 0) {
            setPolylineCoords(decoded);
            setShowRouteActions(true); 
            
            setOriginCoords(route.origin);
            setDestinationCoords(route.destination);
            setOriginAddress(route.originAddress);
            setDestinationAddress(route.destinationAddress);
            
            setIsSheetOpen(true);
            sheetTranslateY.value = withTiming(0, { duration: 300 });

            if (mapRef.current) {
                mapRef.current.fitToCoordinates(decoded, { 
                    edgePadding: { top: 50, right: 50, bottom: SHEET_HEIGHT + 50, left: 50 },
                    animated: true 
                });
            }
        }
    }, 50);
  }, [isRouteActive, resetUIState, sheetTranslateY]);


  /** -------------------------------------------
   * ---------- FLUXO DO HISTÓRICO COMPLETO ---------- 
   * ------------------------------------------- **/

  const handleApplyRouteFromHistory = useCallback((route: SavedRouteStored) => {
    if (isRouteActive) return;

    resetUIState(); 
    openSheet(); 

    const decoded = decodePolyline(route.polyline);
    
    if (decoded && decoded.length > 0) {
        setPolylineCoords(decoded);
        setShowRouteActions(true); 
        setSearchError(null);
        
        setOriginCoords(route.origin);
        setDestinationCoords(route.destination);
        setOriginAddress(route.originAddress);
        setDestinationAddress(route.destinationAddress);
        
        if (mapRef.current) {
            mapRef.current.fitToCoordinates(decoded, { 
                edgePadding: { top: 50, right: 50, bottom: SHEET_HEIGHT + 50, left: 50 },
                animated: true 
            });
        }
    } else {
         Alert.alert("Erro", "Esta rota salva não possui dados de trajeto válidos.");
    }
  }, [isRouteActive, resetUIState, openSheet]);


  const handleNavigateToConfigFromHistory = useCallback((route: SavedRouteStored) => {
     if (isRouteActive) {
         Alert.alert("Aviso", "Finalize a rota ativa antes de configurar outra.");
         return;
     }
    navigation.navigate('routeConfig', {
        polyline: route.polyline,
        distance: route.distance,
        duration: route.duration,
        safetyScore: route.safetyScore,
        
        originCoords: route.origin,
        destinationCoords: route.destination,
        
        originAddress: route.originAddress,
        destinationAddress: route.destinationAddress,
        
        onSaveComplete: handleSaveRouteComplete,
    });
  }, [isRouteActive, navigation, handleSaveRouteComplete]);


  const handleHistoryPress = useCallback(() => {
    if (isRouteActive) {
        Alert.alert("Aviso", "Finalize a rota ativa antes de acessar o histórico.");
        return;
    }
    
    navigation.navigate('historyScreen', { 
        onApplyRoute: handleApplyRouteFromHistory, 
        onNavigateToConfig: handleNavigateToConfigFromHistory,
    });
  }, [isRouteActive, navigation, handleApplyRouteFromHistory, handleNavigateToConfigFromHistory]);


  /** -------------------------------------------
   * ---------- AÇÕES DE AVISO E EMERGÊNCIA (ATUALIZADO) ---------- 
   * ------------------------------------------- **/

  const handleOpenWarningModal = useCallback(() => {
    if (isRouteActive || isSheetOpen) return; 

    // Define a localização padrão do GPS, se disponível, no campo de endereço
    const defaultAddress = gpsLocation ? `Lat: ${gpsLocation.latitude.toFixed(4)}, Lng: ${gpsLocation.longitude.toFixed(4)} (GPS)` : '';
    setWarningAddressInput(defaultAddress);
    setSelectedWarningTag(null);
    setShowWarningModal(true);
  }, [isRouteActive, isSheetOpen, gpsLocation]);


  const handleCreateWarning = useCallback(async () => {
    if (!selectedWarningTag || !warningAddressInput || warningAddressInput.length < 3) {
        Alert.alert('Erro', 'Selecione uma tag e insira um endereço ou coordenadas válidas.');
        return;
    }

    setIsWarningProcessing(true);
    Keyboard.dismiss();

    let targetCoords: Coords | null = null;

    // Tenta geocodificar o endereço inserido
    try {
        targetCoords = await geocodeAddress(warningAddressInput);
    } catch (e) {
        console.error('Erro ao geocodificar aviso:', e);
        // Não é necessário alerta, pois o próximo passo irá capturar se targetCoords for nulo
    }
    
    // Fallback: Tenta parsear coordenadas brutas se a geocodificação falhar e for um padrão de Lat/Lng
    if (!targetCoords) {
        const parts = warningAddressInput.match(/(-?\d+\.?\d*)/g);
        if (parts && parts.length >= 2) {
             const lat = parseFloat(parts[0]);
             const lng = parseFloat(parts[1]);
             if (!isNaN(lat) && !isNaN(lng)) {
                 targetCoords = { latitude: lat, longitude: lng };
             }
        }
    }


    if (!targetCoords) {
        Alert.alert('Erro', 'Não foi possível encontrar as coordenadas para o endereço/texto inserido.');
        setIsWarningProcessing(false);
        return;
    }
    
    // Cria o novo marcador
    const newMarker: CommunityMarker = {
        id: Date.now(), 
        tag: selectedWarningTag.tag,
        icon: selectedWarningTag.icon, 
        time: new Date().toLocaleTimeString('pt-BR'),
        description: selectedWarningTag.desc, 
        lat: targetCoords.latitude,
        lng: targetCoords.longitude,
        isSimulated: false, // Avisos do usuário não são simulados
    };
    
    setUserMarkers(prev => [...prev, newMarker]);
    setShowWarningModal(false);
    setIsWarningProcessing(false);
    
    Alert.alert("Aviso Criado", `Seu alerta "${selectedWarningTag.tag}" foi registrado e compartilhado em: ${warningAddressInput}`);
    
    // Move o mapa para o novo marcador
    mapRef.current?.animateToRegion({
        latitude: targetCoords.latitude,
        longitude: targetCoords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    }, 500);

  }, [selectedWarningTag, warningAddressInput]);


  // Correção: Função de gesto para checar o estado corretamente
  const handleEmergencyGesture = useCallback(({ nativeEvent }: any) => {
      // Verifica se o estado da interação foi ativado (toque longo completo)
      if (nativeEvent.state === State.ACTIVE) {
          // Garante que o alerta só aparece se a rota estiver ativa
          if (!isRouteActive) return; 
          
          Alert.alert(
              "Alerta de Emergência SOS",
              "O toque prolongado foi detectado! Pressione 'Confirmar' para simular o envio de um pedido de ajuda imediata e notificar os contatos de emergência/membros do seu grupo.",
              [
                  { text: "Cancelar", style: "cancel" },
                  { 
                      text: "Confirmar", 
                      style: "destructive",
                      onPress: () => {
                          Alert.alert(
                              "AJUDA SOLICITADA", 
                              "Ajuda foi solicitada, outros membros foram avisados (simulação). Sua localização e rota foram compartilhadas.",
                              [{ text: "OK" }]
                          );
                      }
                  }
              ]
          );
      }
  }, [isRouteActive]); 


  const isAnyLoading = isLocationLoading || routeLoading || isProcessingRoute;

  /** ----------------------------------
   * ---------- RENDERIZAÇÃO ---------- 
   * ---------------------------------- **/

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>ApauraRotas</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => console.log('Config')}>
            {/* Texto do ícone ⚙️: Cor clara */}
            <Text style={{ fontSize: 20, color: LIGHT_TEXT }}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Notif')}>
            {/* Texto do ícone 🔔: Cor clara */}
            <Text style={{ fontSize: 20, color: LIGHT_TEXT }}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GESTURE HANDLER: Captura o toque longo na tela do mapa */}
      <LongPressGestureHandler
          onHandlerStateChange={handleEmergencyGesture} 
          minDurationMs={LONG_PRESS_DURATION}
          shouldCancelWhenOutside={true} 
      >
        <Animated.View style={styles.mapContainer}>
          {/* MAPA */}
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            customMapStyle={DARK_MONOCHROME_MAP_STYLE} // Aplicando o novo estilo monocromático
          >
            {originCoords && (
              <Marker 
                  coordinate={originCoords} 
                  title="Origem Atual" 
                  description={originAddress} 
                  // Cor da origem: azul -> roxo escuro
                  pinColor={PURPLE_ACCENT} 
                  draggable={!isRouteActive && !showRouteActions} 
                  onDragEnd={(e) => {
                      if (!isRouteActive && !showRouteActions) {
                        setOriginCoords(e.nativeEvent.coordinate);
                        setOriginAddress('Marcador Arrastado');
                        setIsOriginInputText(true); 
                      }
                    }}
              />
            )}
            {destinationCoords && (
              <Marker 
                  coordinate={destinationCoords} 
                  title="Destino Final" 
                  description={destinationAddress} 
                  // Cor do destino: vermelho -> roxo claro
                  pinColor={PURPLE_ACCENT} 
                  draggable={!isRouteActive && !showRouteActions} 
                  onDragEnd={(e) => {
                       if (!isRouteActive && !showRouteActions) {
                        setDestinationCoords(e.nativeEvent.coordinate);
                        setDestinationAddress('Marcador Arrastado');
                        setIsDestinationInputText(true); 
                       }
                    }}
              />
            )}
            
            {/* Marcadores de Aviso (Comunitários e Simulados) */}
           {[...userMarkers, ...simulatedWarnings].map(w => {
    // A verificação é mantida, pois é correta:
    const isImage = typeof w.icon === 'number'; 

    return (
       <Marker 
    key={w.id} 
    coordinate={{ latitude: w.lat, longitude: w.lng }} 
    
    
    title={isImage ? w.tag : w.icon + ' ' + w.tag}
    
    description={`${w.description} (Registrado: ${w.time})`} 
    
    // Usamos pinColor APENAS para os marcadores de emoji/string
    pinColor={!isImage ? (w.isSimulated ? WARNING_ORANGE : PURPLE_ACCENT) : undefined}
>
    {/* Renderização da Imagem (Asset Local) */}
    {isImage ? (
        <Image
            source={w.icon as number} 
            style={styles.customImageMarker}
            resizeMode="contain"
        />
    ) : (
       
        <></> 
    )}
</Marker>
    )
})}

            {polylineCoords && polylineCoords.length > 0 && (
              <Polyline 
                coordinates={polylineCoords} 
                strokeColor="#FF9933" // Mantendo a cor laranja-amarelada para a rota
                strokeWidth={5} 
                lineCap="round" 
              />
            )}
          </MapView>
          
          {/* INDICADOR DE GESTO DE EMERGÊNCIA */}
          {isRouteActive && (
              <View style={styles.emergencyIndicator}>
                  <Text style={styles.emergencyIndicatorText}>
                      ⚠️ **SEGURE A TELA POR 1s PARA SOS** ⚠️
                  </Text>
              </View>
          )}

        </Animated.View>
      </LongPressGestureHandler>

      {/* BOTÕES PRINCIPAIS */}
      {!isRouteActive ? (
          <View style={[styles.buttonsRow, isSheetOpen ? { opacity: 0.4 } : { opacity: 1 }]} pointerEvents={isSheetOpen ? 'none' : 'auto'}>
            <TouchableOpacity style={[styles.largeButton, styles.buttonPrimary]} onPress={openSheet} disabled={isSheetOpen}>
              <Text style={styles.largeButtonText}>Nova Rota</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeButton, styles.buttonSecondary]}
              onPress={handleHistoryPress} 
              disabled={isSheetOpen}
            >
              <Text style={styles.largeButtonText}>Histórico</Text>
            </TouchableOpacity>
          </View>
      ) : (
          <View style={styles.activeRouteContainer}>
              <TouchableOpacity style={styles.stopRouteButton} onPress={handleFinalizeRoute}>
                 <Text style={styles.largeButtonText}>FINALIZAR ROTA 🏁</Text>
              </TouchableOpacity>
          </View>
      )}

      {/* BOTÃO ADICIONAR AVISO */}
      <View style={[styles.addWarningRow, (isSheetOpen || showWarningModal) ? { opacity: 0.4 } : { opacity: 1 }]} pointerEvents={(isSheetOpen || showWarningModal) ? 'none' : 'auto'}>
        <TouchableOpacity style={styles.addWarningButton} onPress={handleOpenWarningModal} disabled={isSheetOpen || isRouteActive || showWarningModal}>
          <Text style={styles.addWarningText}>+ Aviso</Text>
        </TouchableOpacity>
      </View>

      {/* OVERLAYS */}
      {isAnyLoading && (
        <View style={styles.loadingOverlay}>
          {/* Cor do indicador para contraste */}
          <ActivityIndicator size="large" color={PURPLE_ACCENT} />
        </View>
      )}
      {(searchError || (routeError && !showRouteActions) || locationError) && (
        <View style={styles.errorBox}>
          {/* Texto de erro claro */}
          <Text style={{ color: LIGHT_TEXT }}>{searchError || (routeError as any) || locationError}</Text>
        </View>
      )}

      {/* BOTTOM SHEET (Nova Rota) */}
      <Animated.View pointerEvents={isSheetOpen ? 'auto' : 'none'} style={[styles.overlay, overlayStyle]} />

      {isSheetOpen && (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.sheetContainer, sheetStyle]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Criar Trajeto</Text>
            
            {/* ... Conteúdo do Bottom Sheet da Rota ... */}
            <Text style={styles.label}>Origem</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Endereço origem"
                placeholderTextColor={MUTED_TEXT} // Adicionado cor para placeholder
                value={originAddress}
                onChangeText={(t) => { setOriginAddress(t); setIsOriginInputText(true); }}
                // Cor do input e texto
                style={[styles.input, { flex: 1, backgroundColor: showRouteActions ? SECONDARY_DARK : PRIMARY_DARK, color: LIGHT_TEXT }]}
                editable={!showRouteActions} 
              />
              <View style={{ width: 10 }} />
              <TouchableOpacity style={styles.gpsButton} onPress={handleUseGPSAsOrigin} disabled={showRouteActions}>
                <Text style={{ color: LIGHT_TEXT }}>GPS</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Destino</Text>
            <TextInput
              placeholder="Endereço destino"
              placeholderTextColor={MUTED_TEXT} // Adicionado cor para placeholder
              value={destinationAddress}
              onChangeText={(t) => { setDestinationAddress(t); setIsDestinationInputText(true); }}
              // Cor do input e texto
              style={[styles.input, { backgroundColor: showRouteActions ? SECONDARY_DARK : PRIMARY_DARK, color: LIGHT_TEXT }]}
              editable={!showRouteActions}
            />

            {/* BOTÕES DE AÇÃO */}
            {!showRouteActions ? (
              <View style={{ marginTop: 20 }}>
                {/* Usando Button nativo com cor roxa para destaque */}
                <Button 
                    title="Calcular Trajeto" 
                    onPress={handleConfirmTrajectory} 
                    disabled={isProcessingRoute}
                    color={PURPLE_ACCENT}
                />
              </View>
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.largeButton, { flex: 1, marginRight: 6, backgroundColor: GPS_GREEN }]}
                  onPress={handleCreateAndStartRoute}
                >
                  <Text style={styles.largeButtonText}>Iniciar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.largeButton, { flex: 1, marginLeft: 6, backgroundColor: PURPLE_ACCENT }]}
                  onPress={handleConfigureRoute}
                >
                  <Text style={styles.largeButtonText}>Configurar</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ marginTop: 10 }}>
              {/* Botão de Fechar/Cancelar com cor de erro para contraste */}
              <Button title="Fechar / Cancelar" onPress={closeSheet} color={ERROR_RED} />
            </View>

            {/* HISTÓRICO RECENTE (Horizontal) */}
            {previousRoutes.length > 0 && (
              <View style={{ marginTop: 16 }}>
                 <Text style={[styles.label, { marginBottom: 4 }]}>Recentes (Salvas):</Text>
                 <FlatList
                  data={previousRoutes}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(it) => it.id}
                  renderItem={({ item }) => {
                    const displayDistance = typeof item.distance === 'number' ? `${item.distance.toFixed(1)} km` : item.distance || 'N/D';

                    return (
                        <TouchableOpacity onPress={() => applyPreviousRoute(item)} style={styles.prevRouteCard}>
                          {/* Texto de card claro/monocromático */}
                          <Text style={{ fontWeight: '600', fontSize: 12, color: LIGHT_TEXT }}>{item.name}</Text>
                          <Text style={{ fontSize: 10, color: MUTED_TEXT }}>
                              {displayDistance} - {item.visibility === 'private' ? 'Privada' : 'Pública'}
                          </Text>
                        </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}

          </Animated.View>
        </PanGestureHandler>
      )}

      {/* MODAL DE AVISO COMUNITÁRIO (NOVO) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWarningModal}
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.warningModalContent}>
                <Text style={styles.sheetTitle}>Registrar Novo Aviso</Text>
                
                {/* 1. INPUT DE ENDEREÇO/COORDENADAS */}
                <Text style={styles.label}>Endereço ou Coordenadas do Aviso</Text>
                <TextInput
                    placeholder="Ex: Rua A, 123 ou -23.5505, -46.6333"
                    placeholderTextColor={MUTED_TEXT}
                    value={warningAddressInput}
                    onChangeText={setWarningAddressInput}
                    style={[styles.input, { backgroundColor: PRIMARY_DARK, color: LIGHT_TEXT }]}
                    editable={!isWarningProcessing}
                />
                <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>2. Selecione a Tag de Aviso (Role para ver mais)</Text>
                
                {/* 2. LISTA ROLÁVEL DE TAGS */}
                <FlatList
                    data={SIMULATION_TAGS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.tag}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.tagButton,
                                selectedWarningTag?.tag === item.tag ? styles.tagSelected : styles.tagDefault,
                            ]}
                            onPress={() => setSelectedWarningTag(item)}
                            disabled={isWarningProcessing}
                        >
                            {/* Texto das tags claro/escuro dependendo do estado */}
                            <Text style={[styles.tagText, selectedWarningTag?.tag === item.tag ? styles.tagTextSelected : styles.tagTextDefault]}>
                               {typeof item.icon === 'string' 
        ? item.icon 
        : ''} 
    {/* Adicione um espaço condicional se a tag for um emoji */}
    {typeof item.icon === 'string' && ' '}
    {item.tag}
                            </Text>
                        </TouchableOpacity>
                    )}
                    style={styles.tagList}
                />
                
                {selectedWarningTag && (
                    <Text style={styles.selectedTagInfo}>
                        Tag Selecionada: {selectedWarningTag.tag} - {selectedWarningTag.desc}
                    </Text>
                )}
                
                {/* 3. BOTÕES DE AÇÃO */}
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity 
                        style={[styles.largeButton, isWarningProcessing ? styles.buttonDisabled : styles.buttonWarning]} 
                        onPress={handleCreateWarning}
                        disabled={isWarningProcessing || !selectedWarningTag || warningAddressInput.length < 3}
                    >
                        <Text style={styles.largeButtonText}>
                            {isWarningProcessing ? 'Processando...' : 'Criar Marcador'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.largeButton, styles.buttonSecondary, { marginTop: 10 }]} 
                        onPress={() => setShowWarningModal(false)}
                        disabled={isWarningProcessing}
                    >
                        <Text style={styles.largeButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY_DARK },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SECONDARY_DARK, 
    elevation: 2,
    marginTop: Platform.OS === 'android' ? 30 : 0,
    zIndex: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333',
  },
  logo: { fontSize: 18, fontWeight: '700', color: LIGHT_TEXT }, 
  headerIcons: { flexDirection: 'row', gap: 12 },
  
  mapContainer: { flex: 1, zIndex: 1 }, 
  map: { width: '100%', height: '100%' },
  
  emergencyIndicator: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    padding: 8,
    backgroundColor: 'rgba(117, 4, 151, 0.75)', 
    borderRadius: 8,
    zIndex: 15,
  },
  emergencyIndicatorText: {
    color: LIGHT_TEXT,
    fontWeight: '700',
    fontSize: 14,
  },
  
  buttonsRow: { position: 'absolute', bottom: 180, left: 38, right: 38, flexDirection: 'row', justifyContent: 'space-between', zIndex: 5 },
  activeRouteContainer: { position: 'absolute', bottom: 96, left: 16, right: 16, alignItems: 'center', zIndex: 5 },
  stopRouteButton: {
      width: '100%',
      backgroundColor: ERROR_RED, // Botão de parar vermelho
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5
  },

  largeButton: {
    padding: 14, borderRadius: 10, alignItems: 'center',
  },
  largeButtonText: { color: LIGHT_TEXT, fontWeight: '700' },
  buttonPrimary: { backgroundColor: PURPLE_ACCENT }, // Roxo
  buttonSecondary: { backgroundColor: '#a338faff' }, // Cinza escuro para secundário (Histórico)
  buttonWarning: { backgroundColor: WARNING_ORANGE }, // Laranja para Aviso
  buttonDisabled: { backgroundColor: '#555' }, // Cinza mais escuro para desabilitado
  
  addWarningRow: { position: 'absolute', bottom: 220, left: 16, right: 16, alignItems: 'center', zIndex: 5 },
  addWarningButton: { 
      backgroundColor: WARNING_ORANGE, // Laranja
      paddingVertical: 12, 
      paddingHorizontal: 20, 
      borderRadius: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3
  },
  addWarningText: { color: LIGHT_TEXT, fontWeight: '600' },

  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 20 },
  errorBox: { position: 'absolute', top: 100, left: 16, right: 16, padding: 12, backgroundColor: ERROR_RED, borderRadius: 8, alignItems: 'center', zIndex: 20 },

  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    bottom: 0,
    backgroundColor: SECONDARY_DARK, // Fundo escuro para sheet
    padding: 18,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 30, 
  },
  sheetHandle: { width: 40, height: 6, backgroundColor: '#444', borderRadius: 10, alignSelf: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: LIGHT_TEXT }, // Texto claro
  label: { fontSize: 13, fontWeight: '600', color: MUTED_TEXT, marginBottom: 6 }, // Texto sutil/cinza
  input: { 
    height: 44, 
    borderWidth: 1, 
    borderColor: '#444', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    backgroundColor: PRIMARY_DARK, // Fundo do input escuro
    color: LIGHT_TEXT // Cor do texto do input clara
  }, 
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#000', zIndex: 25 }, 
  prevRouteCard: {
    backgroundColor: PRIMARY_DARK, // Fundo do card escuro
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444'
  },
  gpsButton: {
    marginLeft: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: GPS_GREEN, // Mantido verde para GPS (pode ser trocado por roxo, mas verde é bom para feedback)
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Styles for the NEW Warning Modal
  modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      padding: 20,
      zIndex: 40,
  },
  warningModalContent: {
      width: '100%',
      backgroundColor: SECONDARY_DARK, 
      borderRadius: 14,
      padding: 20,
      elevation: 20,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 4,
  },
  tagList: {
      maxHeight: 50, 
      marginBottom: 10,
      paddingVertical: 4,
  },
  tagButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 2,
  },
  tagDefault: {
      backgroundColor: PRIMARY_DARK, // Fundo escuro
      borderColor: '#444',
  },
  tagSelected: {
      backgroundColor: PURPLE_ACCENT, // Roxo, combinando com o tema
      borderColor: PURPLE_ACCENT,
  },
  tagText: {
      fontWeight: '600',
  },
  tagTextDefault: {
      color: LIGHT_TEXT, 
  },
  tagTextSelected: {
      color: LIGHT_TEXT, 
  },
  selectedTagInfo: {
      fontSize: 12,
      color: PURPLE_ACCENT, 
      marginTop: 8,
      fontStyle: 'italic',
      textAlign: 'center',
  },
customImageMarker: {
        width: 43, 
        height: 43, 
        
    }
});