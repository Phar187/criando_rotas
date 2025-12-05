import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    ValidateNested, 
} from 'class-validator';
import { CoordsDto } from './coords.dto';

export class routesResponseDto { 
   
    @ValidateNested()
    @Type(() => CoordsDto)
    @IsNotEmpty({ message: 'A coordenada de origem é obrigatória.' })
    origem: CoordsDto; 


    @ValidateNested()
    @Type(() => CoordsDto)
    @IsNotEmpty({ message: 'A coordenada de destino é obrigatória.' })
    destino: CoordsDto; 

   
}