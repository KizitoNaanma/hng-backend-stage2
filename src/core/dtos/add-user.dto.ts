import { IsNotEmpty, IsString } from "class-validator";

export class AddUserDto {
    @IsNotEmpty()
    @IsString()
    userId: string
}