import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SkinService } from 'src/skin/skin.service';
import {
    StandAvatar3DService,
    HeadAvatar3DService,
    ChibiAvatar3DService,
} from './services';
import { RendererUtil, PngUtil, FxxaUtil } from './utils';
import { CacheUtil } from 'src/common/utils/cache.util';
import { Avatar3DController } from './3d.controller';

@Module({
    imports: [HttpModule],
    controllers: [Avatar3DController],
    providers: [
        StandAvatar3DService,
        HeadAvatar3DService,
        ChibiAvatar3DService,
        RendererUtil,
        PngUtil,
        FxxaUtil,
        CacheUtil,
        SkinService,
    ],
})
export class Avatar3DModule {}
