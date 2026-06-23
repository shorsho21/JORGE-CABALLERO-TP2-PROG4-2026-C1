import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://jorge-caballero-tp-2-prog-4-2026-c1-delta.vercel.app',
      'https://jorge-caballero-tp-2-prog-4-2026-c1-th72-lcm7l1xrw.vercel.app',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
