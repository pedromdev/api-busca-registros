import { Sort } from '../../common/enum/sort';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class OrdemMensagemDto {
  @IsEnum(Sort)
  @IsOptional()
  @ApiPropertyOptional({ enum: Sort, name: 'email' })
  email?: Sort;

  @IsEnum(Sort)
  @IsOptional()
  @ApiPropertyOptional({ enum: Sort, name: 'assunto' })
  assunto?: Sort;
}
