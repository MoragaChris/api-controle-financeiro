import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SimulacaoService } from './simulacao.service.js';
import { RendaFixaDto } from './dto/renda-fixa.dto.js';

@Controller('simulacao')
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  @Post('renda-fixa')
  @HttpCode(200)
  calcularRendaFixa(@Body() dto: RendaFixaDto) {
    return this.simulacaoService.calcularRendaFixa(dto);
  }
}