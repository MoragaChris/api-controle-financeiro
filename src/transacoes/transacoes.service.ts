import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { CreateTransacaoDto } from './dto/create-transacao.dto.js';
import {
  TIPOS_TRANSACAO,
  type Transacao,
} from './schemas/transacao.schema.js';

export interface Metricas {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface ResumoTransacoes {
  historico: Transacao[];
  metricas: Metricas;
}

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel('Transacao') private readonly transacaoModel: Model<Transacao>,
  ) {}

  // CREATE
  async createTransacao(dto: CreateTransacaoDto): Promise<string> {
    this.validar(dto);

    const transacao = new this.transacaoModel({
      descricao: dto.descricao,
      valor: dto.valor,
      tipo: dto.tipo,
      categoria: dto.categoria,
      consumoConsciente: dto.consumoConsciente ?? true,
    });
    const result = await transacao.save();
    return result.id as string;
  }

  // READ (histórico + métricas consolidadas)
  async readTransacoes(): Promise<ResumoTransacoes> {
    const docs = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    // Remove _id e __v e deixa o objeto igual à interface
    const historico: Transacao[] = docs.map((t) => ({
      id: t.id,
      descricao: t.descricao,
      valor: t.valor,
      tipo: t.tipo,
      categoria: t.categoria,
      consumoConsciente: t.consumoConsciente,
    }));

    return { historico, metricas: this.calcularMetricas(historico) };
  }

  calcularMetricas(transacoes: Transacao[]): Metricas {
    let receitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const t of transacoes) {
      if (t.tipo === 'receita') {
        receitas += t.valor;
      } else if (t.tipo === 'despesa') {
        totalDespesas += t.valor;
        if (t.consumoConsciente === false) {
          totalGastoImpulso += t.valor;
        }
      }
    }

    return {
      saldoTotal: this.arredondar(receitas - totalDespesas),
      totalDespesas: this.arredondar(totalDespesas),
      totalGastoImpulso: this.arredondar(totalGastoImpulso),
    };
  }

  private validar(dto: CreateTransacaoDto): void {
    const erros: string[] = [];

    if (typeof dto?.descricao !== 'string' || !dto.descricao.trim()) {
      erros.push('descricao é obrigatória (texto).');
    }
    if (
      typeof dto?.valor !== 'number' ||
      !Number.isFinite(dto.valor) ||
      dto.valor < 0
    ) {
      erros.push('valor é obrigatório (número maior ou igual a zero).');
    }
    if (!TIPOS_TRANSACAO.includes(dto?.tipo)) {
      erros.push('tipo deve ser "receita" ou "despesa".');
    }
    if (typeof dto?.categoria !== 'string' || !dto.categoria.trim()) {
      erros.push('categoria é obrigatória (texto).');
    }
    if (
      dto?.consumoConsciente !== undefined &&
      typeof dto.consumoConsciente !== 'boolean'
    ) {
      erros.push('consumoConsciente deve ser true ou false.');
    }

    if (erros.length > 0) {
      throw new BadRequestException(erros);
    }
  }

  private arredondar(valor: number): number {
    return Math.round(valor * 100) / 100;
  }
}
