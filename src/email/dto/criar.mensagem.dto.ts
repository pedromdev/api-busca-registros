import { IsNumber, IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarMensagemDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  codigo: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  assunto: string;
}
