import {
    IsEmail,
    IsNotEmpty,
    IsNumber, 
} from 'class-validator';

export class CoordsDto {
  
    @IsNumber({}, { message: 'Latitude deve ser um número válido.' })
    @IsNotEmpty({ message: 'Latitude é obrigatória.' })
    latitude: number; // <--- AQUI ESTÁ O LAT

    @IsNumber({}, { message: 'Longitude deve ser um número válido.' })
    @IsNotEmpty({ message: 'Longitude é obrigatória.' })
    longitude: number; // <--- AQUI ESTÁ O LONG
}