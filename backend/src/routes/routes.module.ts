import { Module, Provider } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { GOOGLE_MAPS_CLIENT } from './routes.constants';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigModule, ConfigService } from '@nestjs/config';



const mapsClientProvider: Provider = {
  provide: GOOGLE_MAPS_CLIENT, 
  

  useFactory: (configService: ConfigService) => { 

    return new Client({}); 
  },
  
 
  inject: [ConfigService], 
};


@Module({
    imports: [ConfigModule],
    controllers: [RoutesController],
    providers: [RoutesService, mapsClientProvider],

})


export class RoutesModule{}

