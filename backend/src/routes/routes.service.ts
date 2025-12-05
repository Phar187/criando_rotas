import {Injectable, Inject, Module, InternalServerErrorException} from "@nestjs/common"
import { routesResponseDto } from "./dto"
import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config'; // Usado para acessar o .env
import { GOOGLE_MAPS_CLIENT } from './routes.constants';




@Injectable()
export class RoutesService {
  constructor(
    @Inject(GOOGLE_MAPS_CLIENT)
    private readonly googleMapsClient: Client, // Seu cliente injetado
    private readonly configService: ConfigService, // Injeta o ConfigService
  ) {}

  async response(dtp:routesResponseDto ) {

    const {destino, origem} = dtp
    
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'A variável de ambiente GOOGLE_MAPS_API_KEY não está configurada.',
      );
    }

   
    const response = await this.googleMapsClient
      .directions({
        params: {
          // Passagem dos valores do controller (origem, destino)
          origin: origem,
          destination: destino,
          mode: TravelMode.walking, // Modo de transporte
          key: apiKey, // Inclusão da API Key
        },
        timeout: 1000,
      });

   
    if (response.data.routes && response.data.routes.length > 0) {
      return {
       
        polyline: response.data.routes[0].overview_polyline.points,
        distance: response.data.routes[0].legs[0].distance.text,
        duration: response.data.routes[0].legs[0].duration.text,
      };
    }

  
    throw new Error('Nenhuma rota encontrada.');
  }
}



