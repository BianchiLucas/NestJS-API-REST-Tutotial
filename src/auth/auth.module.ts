import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [PrismaModule],   // Importa el acceso a los demás módulos y sus servicios (de estar disponibles) 
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}