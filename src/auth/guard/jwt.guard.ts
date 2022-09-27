import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
};
// 'jwt' es el string por default de la class Strategy de PassportStrategy provisto por Passport (ver jwt.strategy.ts)