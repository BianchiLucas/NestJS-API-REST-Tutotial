import { IsNotEmpty, IsOptional, IsString } from "class-validator";
// Los validadores empiezan en mayúsculas, no se para que son los que empiezan en minúsculas.
// @IsOptional es el validador y el signo ? es por Typescript

export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    link?: string
}