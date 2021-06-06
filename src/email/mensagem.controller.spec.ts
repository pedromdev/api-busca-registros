import { Test, TestingModule } from '@nestjs/testing';
import { MensagemController } from './mensagem.controller';

describe('MensagemController', () => {
  let controller: MensagemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MensagemController],
    }).compile();

    controller = module.get<MensagemController>(MensagemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
