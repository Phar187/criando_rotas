import { Module } from '@nestjs/common';
import { RoutesModule } from './routes/routes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RoutesModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
