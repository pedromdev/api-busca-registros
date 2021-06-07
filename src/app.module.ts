import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get('DATABASE_URI'),
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: 'admin',
          connectionFactory: (connection) => {
            connection.plugin(uniqueValidator);
            return connection;
          },
        };
      },
    }),
    EmailModule,
  ],
})
export class AppModule {}
