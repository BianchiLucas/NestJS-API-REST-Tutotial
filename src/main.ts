import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Validation Pipes Globaly:
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))

  await app.listen(3333);
}
bootstrap();

// whitelist quita los elementos a validar de los objetos que no tengan Decorator (no definidos en los dtos).