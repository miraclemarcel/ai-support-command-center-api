import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateCustomerDto { @IsString() fullName:string; @IsOptional() @IsEmail() email?:string; @IsOptional() @IsString() phone?:string; @IsOptional() @IsString() country?:string; @IsOptional() @IsString() notes?:string; }
export class UpdateCustomerDto { @IsOptional() @IsString() fullName?:string; @IsOptional() @IsEmail() email?:string; @IsOptional() @IsString() phone?:string; @IsOptional() @IsString() country?:string; @IsOptional() @IsString() notes?:string; }
