import type { TipoTransacao } from '../schemas/transacao.schema.js';

export class CreateTransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  consumoConsciente?: boolean;
}
