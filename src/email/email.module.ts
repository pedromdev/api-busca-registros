import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mensagem, MensagemSchema } from './schemas/mensagem.schema';
import { MensagemController } from './mensagem.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mensagem.name, schema: MensagemSchema },
    ]),
  ],
  controllers: [MensagemController],
})
export class EmailModule {}
