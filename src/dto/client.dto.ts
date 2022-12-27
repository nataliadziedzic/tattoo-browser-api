import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ClientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({ minLength: 6, minUppercase: 1 })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsArray()
  preferredTechniques: string[];

  @IsOptional()
  @IsString()
  profilePicture: string;
}
