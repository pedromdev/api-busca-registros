import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';

@Injectable()
export class MongoQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item, metadata));
    } else if (typeof value !== 'object' || !value) {
      return value;
    }

    const mongoKeys = ['eq', 'ne', 'in', 'nin', 'not', 'and', 'or'];

    return Object.keys(value).reduce((obj, key) => {
      if (mongoKeys.includes(key)) {
        return {
          ...obj,
          [`$${key}`]: this.transform(value[key], metadata),
        };
      }

      return {
        ...obj,
        [key]: this.transform(value[key], metadata),
      };
    }, {});
  }
}
