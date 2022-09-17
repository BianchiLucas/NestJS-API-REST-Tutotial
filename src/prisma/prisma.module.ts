import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // El acceso a el módulo estará disponible para los demás

@Module({
  providers: [PrismaService],
  exports: [PrismaService] // Exporta los servicios propios del Módulo 
})
export class PrismaModule {}
