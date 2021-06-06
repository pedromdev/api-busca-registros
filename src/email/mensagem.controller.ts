import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mensagem } from './schemas/mensagem.schema';
import { Model, FilterQuery } from 'mongoose';
import { FiltroMensagemDto } from './dto/filtro.mensagem.dto';
import { OrdemMensagemDto } from './dto/ordem.mensagem.dto';
import { MongoQueryPipe } from './pipes/mongo.query.pipe';
import { ApiRequest } from '../common/decorator/api.request';

@Controller('mensagem')
export class MensagemController {
  constructor(
    @InjectModel(Mensagem.name)
    private mensagemModel: Model<Mensagem>,
  ) {}

  @Get()
  @ApiRequest(FiltroMensagemDto, OrdemMensagemDto)
  async buscar(
    @Query('filtro', MongoQueryPipe) filtro?: FiltroMensagemDto,
    @Query('ordem') ordem?: OrdemMensagemDto,
  ) {
    return {
      data: await this.mensagemModel.find(
        filtro as FilterQuery<Mensagem>,
        undefined,
        { sort: ordem },
      ),
    };
  }
}
