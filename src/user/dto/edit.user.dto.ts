import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

}

// Datos posibles de editar para el user