import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// Connect to the DataBase by extending to PrismaClient (es una class que permite contectarse a la DB)

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                }
            }
        })
    }
}

// ConfigService es el módulo para manejar variables de entorno y configs. Esta basado den dotenv y reemplaza el process.env por config.get()