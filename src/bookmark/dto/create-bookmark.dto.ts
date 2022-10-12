import { IsNotEmpty, IsOptional, IsString } from "class-validator";
// Los validadores empiezan en mayúsculas, no se para que son los que empiezan en minúsculas.

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsNotEmpty()
    link: string
}