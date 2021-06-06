import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';

export class ComparacaoTextoDto {
  @IsOptional()
  @ApiPropertyOptional()
  eq?: string;

  @IsOptional()
  @ApiPropertyOptional()
  ne?: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  in?: string[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [String] })
  nin?: string[];
}
