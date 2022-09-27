import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //ENDPOINTS
    //Decorator @Body() permite obtener el body de la request
    //dtos: Data Transfer Objects -> object where push data from request and can run validations on it.

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK)    // Reemplaza el 201 por 200
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto)
    }
}
//pivate reemplaza this.authService = authService