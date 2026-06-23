import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://jorge-caballero-tp-2-prog-4-2026-c1-ten.vercel.app',
      'https://jorge-caballero-tp-2-prog-4-2026-c1-qvas-avzn6t8c9.vercel.app',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
