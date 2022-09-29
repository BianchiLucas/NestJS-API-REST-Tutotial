import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)

@Controller('users')
export class UserController {
    // Utilizar Guard para proteger (bloquear) las rutas en caso de que no se presente un token válido

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }
}
