import { Controller, Get, Query, Post, Body, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mensagem } from './schemas/mensagem.schema';
import { Model, FilterQuery } from 'mongoose';
import { FiltroMensagemDto } from './dto/filtro.mensagem.dto';
import { OrdemMensagemDto } from './dto/ordem.mensagem.dto';
import { MongoQueryPipe } from './pipes/mongo.query.pipe';
import { ApiRequest } from '../common/decorator/api.request';
import { CriarMensagemDto } from './dto/criar.mensagem.dto';
import { ValidationErrorFilter } from '../common/error/validation.error.filter';

@Controller('mensagem')
@UseFilters(ValidationErrorFilter)
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

  @Post()
  async criar(@Body() data: CriarMensagemDto): Promise<Mensagem> {
    return await this.mensagemModel.create(data as Mensagem);
  }
}
