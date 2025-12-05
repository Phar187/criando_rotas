import { Body, Controller, Post, Get} from "@nestjs/common"
import { RoutesService } from "./routes.service"
import { routesResponseDto } from "./dto"

@Controller('routes')
export class RoutesController{
    constructor(private routesservice: RoutesService){}

    @Post('preview')
    preview(@Body() dto: routesResponseDto){


        return this.routesservice.response(dto)

    }

  
}