import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Monnet Project Test API')
        .setDescription('Desafio Técnico Monnet - Jose Vetancourt')
        .setVersion('1.0.0')
        .addBearerAuth() 
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(`🚀 API escuchando en http://localhost:${port} (docs en /docs)`);
}
bootstrap();