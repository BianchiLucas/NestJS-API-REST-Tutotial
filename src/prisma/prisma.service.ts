import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// Connect to the DataBase by extending to PrismaClient (es una class que permite contectarse a la DB)

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                }
            }
        })
    }

    // Hook para vaciar la DB (para los tests e2e) en orden tal que las Bookmarks se eliminen previo a los Users y no generen problemas:
    cleanDB() {
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ])
    }
}

// ConfigService es el módulo para manejar variables de entorno y configs. Esta basado den dotenv y reemplaza el process.env por config.get()