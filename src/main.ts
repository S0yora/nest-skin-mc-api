import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('APP_PORT') || 3001;
    await app.listen(port);
    console.log(`nest minecraft skin api listening on port ${port}`);
}

bootstrap();
