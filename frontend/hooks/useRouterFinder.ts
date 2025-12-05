import { useState, useCallback } from 'react';

import { RouteDataRequest, RouteDataResponse, Coords } from '../types' 

const API_BASE_URL = 'localhost';  //seu ip e porta 
const API_ENDPOINT = `${API_BASE_URL}/routes/preview`; // O endpoint POST definido

const extractNumberFromString = (str: any): number => {
    if (typeof str === 'number') {
        return str;
    }
    if (typeof str !== 'string') {
        return NaN; // Se não for string nem número, retorna NaN
    }
    
   
    const cleanedString = str.replace(/,/g, ''); 
    

    const match = cleanedString.match(/[\d\.]+/);
    
    if (match) {
       
        return parseFloat(match[0]);
    }

    return NaN; // Se não encontrar números, retorna NaN
};


export interface UseRouteFinderResult {
  routeData: RouteDataResponse | null;
  isLoading: boolean;
  error: string | null;
  
  findRoute: (origem: Coords, destino: Coords) => Promise<void>;
}




export const useRouteFinder = (): UseRouteFinderResult => {
  const [routeData, setRouteData] = useState<RouteDataResponse | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  

  const findRoute = useCallback(async (
    origem: Coords, 
    destino: Coords)  => {
  
    setIsLoading(true);
    setError(null);
    setRouteData(null); // Limpa dados anteriores

   
    const requestBody: RouteDataRequest = { 
        origem, 
        destino,
      
        
    };

    try {

      // Se API_BASE_URL foi alterada, executa a parte real
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

     
      // 1. RECEBE A RESPOSTA BRUTA
      const rawResult = await response.json();
      
      // 2. EXTRAÇÃO ROBUSTA: Verifica se a API retornou chaves em Inglês ou Português
      const rawDistance = rawResult.distance || rawResult.distancia;
      const rawDuration = rawResult.duration || rawResult.duracao;
      const rawSafetyScore = rawResult.safetyScore || rawResult.pontuacaoSeguranca; 
      
      // 3. LIMPEZA E CONVERSÃO DE TIPOS: Usa a função utilitária para garantir
      //    que apenas o número seja extraído da string (ex: "12 km" -> 12).
      const result: RouteDataResponse = {
      
        distance: rawDistance,
        duration: rawDuration,



        polyline: rawResult.polyline,
        safetyScore: rawSafetyScore ? extractNumberFromString(rawSafetyScore) : undefined,
        alerts: false
      };

     

      setRouteData(result);

    } catch (err) {
      console.error("Erro ao buscar rota:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao buscar rota.");
    } finally {
      setIsLoading(false);
      
    }
  }, []); 

  // CORREÇÃO 3: Retorna o estado `currentTravelMode` (não nulo)
  return { routeData, isLoading, error, findRoute };
};