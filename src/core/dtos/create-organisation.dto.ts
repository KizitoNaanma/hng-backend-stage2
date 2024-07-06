import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganisationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
