import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// El acceso a el módulo estará disponible para los demás
@Global()  
@Module({
  providers: [PrismaService],
  exports: [PrismaService]  
})
export class PrismaModule {}

// Exports exporta los servicios propios del Módulo