// Interface para Coordenadas (Latitude e Longitude)
export interface Coords {
    latitude: number;
    longitude: number;
}

// Interface para a estrutura básica de dados de Rota (Resposta da API)
export interface RouteDataResponse {
    alerts: boolean;
    // Distância total percorrida (ex: em metros ou quilômetros, dependendo do backend)
    distance: number; 
    // Duração total da viagem (ex: em segundos)
    duration: number; 
    // String codificada (Google Encoded Polyline) para desenhar o caminho no mapa
    polyline: string; 
    // Pontuação de segurança da rota (0 a 100), se calculada pelo backend
    safetyScore?: number; 
}

// Interface para a Requisição de Dados de Rota (payload enviado ao backend)
// O campo origem/destino aceita tanto coordenadas exatas (Coords) quanto um endereço de texto (string)
export interface RouteDataRequest {
    origem: Coords | string;
    destino: Coords | string;
    // Filtro de preferência, se necessário
    preference?: 'safer' | 'faster' | 'shorter'; 
}

// Estruturas de Dados para o Histórico de Rotas
export interface RouteHistoryItem {
    id: number;
    name: string; // Ex: Casa -> Trabalho
    date: string; // Ex: "20/Out/2025"
    distance: string; // Ex: "5.2 km"
    tags: string[]; // Ex: ["Segura", "Rápida"]
    // Adiciona a referência às coordenadas ou dados completos da rota
    routeData?: RouteDataResponse; 
}


export interface CommunityMarker {
    id: number;
    lat: number;
    lng: number;
    tag: string; 
    icon: string; 
    time: string; 
    description?: string; 
}

export type TabParamList = {
  index: { initialMarker?: Coords } | undefined; // parâmetro opcional
  dashboard: undefined;
  settings: undefined;
};


export interface SavedRoute {
    id: string; 
    name: string; 
    
    createdAt: number;
    
    originAddress: string; 
    destinationAddress: string; 

    origin: Coords;
    destination: Coords;

    polyline: string;
    distance: number;
    duration: number;
    safetyScore?: number;

    visibility: "private" | "group" | "public"; 
    members: string[]; 
    reason: string; 
}

export interface UserData {
 // uid: string;            
  email: string;          
  id?: string;            
  name?: string | null;          
  createdAt?: number;     
  lastLogin?: number;    
}
