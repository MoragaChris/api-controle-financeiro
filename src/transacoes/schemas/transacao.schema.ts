import mongoose from 'mongoose';

export const TIPOS_TRANSACAO = ['receita', 'despesa'] as const;
export type TipoTransacao = (typeof TIPOS_TRANSACAO)[number];

export const TransacaoSchema = new mongoose.Schema(
  {
    descricao: { type: String, required: true, trim: true },
    valor: { type: Number, required: true, min: 0 },
    tipo: { type: String, required: true, enum: TIPOS_TRANSACAO },
    categoria: { type: String, required: true, trim: true },
    // Marcador de consumo consciente (ODS 12): true = gasto essencial/planejado,
    // false = gasto por impulso.
    consumoConsciente: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  consumoConsciente: boolean;
  criadoEm?: Date;
}
