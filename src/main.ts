import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

// Carrega o arquivo .env (se existir) antes de iniciar a aplicação.
try {
  process.loadEnvFile();
} catch {
  // sem .env: usa as variáveis de ambiente do sistema
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
