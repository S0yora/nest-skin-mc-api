import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SkinService } from 'src/skin/skin.service';
import {
    FaceAvatar2DService,
    BustAvatar2DService,
    TorsoAvatar2DService,
    BodyAvatar2DService,
} from './services';
import { CanvasUtil, DrawUtil } from './utils';
import { CacheUtil } from 'src/common/utils/cache.util';
import { Avatar2DController } from './2d.controller';

@Module({
    imports: [HttpModule],
    controllers: [Avatar2DController],
    providers: [
        FaceAvatar2DService,
        BustAvatar2DService,
        TorsoAvatar2DService,
        BodyAvatar2DService,
        CanvasUtil,
        DrawUtil,
        CacheUtil,
        SkinService,
    ],
})
export class Avatar2DModule {}
