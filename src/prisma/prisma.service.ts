import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Connect to the DataBase by extending to PrismaClient (es una class que permite contectarse a la DB)

@Injectable()
export class PrismaService extends PrismaClient{
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://postgres:123@localhost:5434/nest?schema=public'
                }
            }
        })
    }
}
