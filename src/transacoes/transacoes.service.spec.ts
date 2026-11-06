import { BadRequestException } from '@nestjs/common';
import { TransacoesService } from './transacoes.service.js';
import type { Transacao } from './schemas/transacao.schema.js';

function criarServiceComDocs(docs: Partial<Transacao>[]) {
  const model: any = function () {};
  model.find = () => ({ sort: () => ({ exec: async () => docs }) });
  return new TransacoesService(model);
}

describe('TransacoesService', () => {
  it('calcula saldo, total de despesas e gasto por impulso', async () => {
    const service = criarServiceComDocs([
      { id: '1', descricao: 'Salário', valor: 3000, tipo: 'receita', categoria: 'Renda', consumoConsciente: true },
      { id: '2', descricao: 'Conta de Luz', valor: 150.5, tipo: 'despesa', categoria: 'Moradia', consumoConsciente: true },
      { id: '3', descricao: 'Compra de Roupas', valor: 200.25, tipo: 'despesa', categoria: 'Lazer', consumoConsciente: false },
    ]);

    const resposta = await service.readTransacoes();

    expect(resposta.historico).toHaveLength(3);
    expect(resposta.metricas).toEqual({
      saldoTotal: 2649.25,
      totalDespesas: 350.75,
      totalGastoImpulso: 200.25,
    });
  });

  it('retorna métricas zeradas quando não há transações', async () => {
    const resposta = await criarServiceComDocs([]).readTransacoes();
    expect(resposta.metricas).toEqual({
      saldoTotal: 0,
      totalDespesas: 0,
      totalGastoImpulso: 0,
    });
  });

  it('rejeita tipo diferente de receita/despesa', async () => {
    const service = criarServiceComDocs([]);
    await expect(
      service.createTransacao({
        descricao: 'Teste',
        valor: 10,
        tipo: 'outro' as any,
        categoria: 'Lazer',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
