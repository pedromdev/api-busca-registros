import { Document } from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class Mensagem {
  @Prop({})
  codigo: number;

  @Prop()
  email: string;

  @Prop()
  assunto: string;
}

export type MensagemDocument = Mensagem & Document;

export const MensagemSchema = SchemaFactory.createForClass(Mensagem);
