import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ApiRequest = (filtro: Function, ordem: Function) =>
  applyDecorators(
    ApiExtraModels(filtro, ordem),
    ApiQuery({
      name: 'filtro',
      style: 'deepObject',
      type: 'object',
      explode: true,
      required: false,
      schema: {
        $ref: getSchemaPath(filtro),
      },
    }),
    ApiQuery({
      name: 'ordem',
      style: 'deepObject',
      type: 'object',
      explode: true,
      required: false,
      schema: {
        $ref: getSchemaPath(ordem),
      },
    }),
  );
