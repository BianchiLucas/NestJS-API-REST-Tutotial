import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    // Utilizar Guard para proteger (bloquear) las rutas en caso de que no se presente un token válido
    // 'jwt' es el string por default de la class Strategy de PassportStrategy provisto por Passport (ver jwt.strategy.ts)

    @UseGuards(AuthGuard('jwt')) 

    @Get('me')
    getMe() {
        return 'User info'
    }
}
