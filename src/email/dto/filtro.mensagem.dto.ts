import { ApiPropertyOptional } from '@nestjs/swagger';
import { ComparacaoTextoDto } from '../../common/dto/comparacao.texto.dto';
import { ValidateNested } from 'class-validator';

const example = {
  email: {
    eq: 'string',
    ne: 'string',
    in: ['string'],
    nin: ['string'],
  },
  assunto: {
    eq: 'string',
    ne: 'string',
    in: ['string'],
    nin: ['string'],
  },
};

export class FiltroMensagemDto {
  @ValidateNested()
  @ApiPropertyOptional({ type: () => ComparacaoTextoDto })
  email?: ComparacaoTextoDto;

  @ValidateNested()
  @ApiPropertyOptional({ type: () => ComparacaoTextoDto })
  assunto?: ComparacaoTextoDto;

  @ValidateNested()
  @ApiPropertyOptional({ type: () => FiltroMensagemDto, example })
  not?: FiltroMensagemDto;

  @ValidateNested()
  @ApiPropertyOptional({
    type: () => FiltroMensagemDto,
    isArray: true,
    example: [example],
  })
  and?: FiltroMensagemDto[];

  @ValidateNested()
  @ApiPropertyOptional({
    type: () => FiltroMensagemDto,
    isArray: true,
    example: [example],
  })
  or?: FiltroMensagemDto[];

  @ValidateNested()
  @ApiPropertyOptional({
    type: () => FiltroMensagemDto,
    isArray: true,
    example: [example],
  })
  nor?: FiltroMensagemDto[];
}
