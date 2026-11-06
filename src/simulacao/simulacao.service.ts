import { Injectable } from '@nestjs/common';
import { RendaFixaDto } from './dto/renda-fixa.dto.js';

@Injectable()
export class SimulacaoService {
    calcularRendaFixa(dto: RendaFixaDto) {
        const { aporteInicial, aporteMensal, taxaAnual, prazoMeses } = dto;

        const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
        
        let saldo = aporteInicial;
        let totalInvestido = aporteInicial;

        for (let mes = 1; mes <= prazoMeses; mes++) {
            saldo += aporteMensal;
            totalInvestido += aporteMensal;
            saldo = saldo * (1 + taxaMensal);
        }
    

        const totalJuros = saldo - totalInvestido;

        return{
            resumo: {
                totalInvestido: this.arredondar(totalInvestido),
                totalJuros: this.arredondar(totalJuros),
                montanteBruto: this.arredondar(saldo),
            },
            parametrosUtilizados: {
                taxaMensalAplicada: Number(taxaMensal.toFixed(5)),
            },
        };
    }



    private arredondar(valor: number): number {
    return Math.round(valor * 100) / 100;
    }
}
