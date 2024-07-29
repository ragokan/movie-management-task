import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLogger } from './common/custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    logger: new CustomLogger(),
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, errorHttpStatusCode: 400 }),
  );

  const config = new DocumentBuilder()
    .setTitle('Movie Management Task')
    .setDescription('The Movie Management System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  console.log('Server is running on http://localhost:3000');
  console.log('Swagger is available on http://localhost:3000/swagger');
  await app.listen(3000);
}
bootstrap();
