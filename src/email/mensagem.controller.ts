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
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@Controller('mensagem')
@UseFilters(ValidationErrorFilter)
export class MensagemController {
  constructor(
    @InjectModel(Mensagem.name)
    private mensagemModel: Model<Mensagem>,
  ) {}

  @Get()
  @ApiRequest(FiltroMensagemDto, OrdemMensagemDto)
  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'array',
          example: [
            {
              _id: '60bd75da5de48e020a42d1a7',
              codigo: 10000,
              email: 'example@email.com',
              assunto: 'string',
              __v: 0,
            },
          ],
        },
      },
    },
  })
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
  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          type: 'object',
          example: {
            _id: '60bd75da5de48e020a42d1a7',
            codigo: 10000,
            email: 'example@email.com',
            assunto: 'string',
            __v: 0,
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        status: 400,
        messages: ['Error message'],
        error: 'Bad Request',
      },
    },
  })
  async criar(@Body() data: CriarMensagemDto): Promise<Mensagem> {
    return await this.mensagemModel.create(data as Mensagem);
  }
}
