import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Validation Pipes Globaly:
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))

  const config = new DocumentBuilder()
    .setTitle('Bookmarks project')
    .setDescription('Bookmarks project using nestjs, Prisma db with Docker compose, jwt, passport y e2e tests whit pactum')
    .setVersion('1.0.0')
    .addTag('nestjs')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(process.env.PORT || 3333);
}
bootstrap();

// whitelist quita los elementos a validar de los objetos que no tengan Decorator (no definidos en los dtos).