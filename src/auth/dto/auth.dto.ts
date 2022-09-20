import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    //Validar campos con "class-validators" propios de los Pipes de NestJs
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}