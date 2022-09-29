import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from "argon2"
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {

    }

    // Funciones 

    async signup(dto: AuthDto) {
        // Generar el password hash
        const hash = await argon.hash(dto.password)

        // Guardar el nuevo usuario en la DB
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            });

            // Retornar el usuario guardado (sin el hash)
            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        };
    }; // P2002 es el código de Nest para duplicated field 

    async signin(dto: AuthDto) {
        // Encontrar el usuario según email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        // Si el usuario no existe -> throw exception
        if (!user) throw new ForbiddenException('Credentials incorrect');

        // Comparar password (verify es el método de argon2)
        const pwMatches = await argon.verify(user.hash, dto.password);

        // Si la password no coincide -> throw exception
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

        // Retornar el usuario 
        return this.signToken(user.id, user.email)
    };

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {

        // Construir el objeto payload
        const payload = {
            sub: userId,
            email
        };

        // Definir la variable secreta (variable de entorno)
        const secret = this.config.get('JWT_SECRET');

        // Retornar el token encoded según el metodo signAsync de jwt
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        });

        return {
            access_token: token,
        }
    }
}