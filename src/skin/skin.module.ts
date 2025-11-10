import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SkinController } from './skin.controller.js';
import { SkinService } from './skin.service';

@Module({
    imports: [HttpModule],
    controllers: [SkinController],
    providers: [SkinService],
})
export class SkinModule {}
