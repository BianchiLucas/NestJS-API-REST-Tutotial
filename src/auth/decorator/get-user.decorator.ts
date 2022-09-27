
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

// Este Custom Decorator reemplaza la expresión @Req() req: Request. Ergo la const request es una Request de Express.