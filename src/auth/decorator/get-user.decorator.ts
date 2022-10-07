
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        if (data) {
            return request.user[data]
        }
        return request.user;
    },
);

// Este Custom Decorator reemplaza la expresión @Req() req: Request. Ergo la const request es una Request de Express.