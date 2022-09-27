import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

// SecretOrKey es la clave secreta de jwt definida en .env -> es necesario injectar configService en el constructor

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    // El payload a retornar es un objeto (user) con toda la data
    // LA información del usuario viene desde la base de datos:
    async validate(payload: {
        sub: number,
        email: string
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        })
        delete user.hash;  // Para no exponer información

        return user;
    }
};

// "private" declara automaticamente la variable [VER DETALLES]