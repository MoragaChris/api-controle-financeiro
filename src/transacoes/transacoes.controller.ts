import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/create-transacao.dto.js';
import { TransacoesService } from './transacoes.service.js';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Get()
  readAllTransacoes() {
    return this.transacoesService.readTransacoes();
  }

  @Post()
  async createTransacao(@Body() dto: CreateTransacaoDto) {
    const id = await this.transacoesService.createTransacao(dto);
    return { id };
  }
}
