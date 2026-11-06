import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SimulacaoModule } from './simulacao/simulacao.module.js';
import { TransacoesModule } from './transacoes/transacoes.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'simulador-api',
    }),
    // A string de conexão do MongoDB Atlas fica na variável MONGODB_URI (arquivo .env),
    // para que usuário e senha nunca sejam publicados no GitHub.
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
          throw new Error(
            'Defina a variável MONGODB_URI no arquivo .env (veja .env.example).',
          );
        }
        return { uri };
      },
    }),
    SimulacaoModule,
    TransacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
