import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2"
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

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
            delete user.hash

            // Retornar el usuario guardado (sin el hash)
            return user;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
    } // P2002 es el código de Nest para duplicated field 

    signin() {
        return {
            msg: 'I have signed in'
        }
    }
}