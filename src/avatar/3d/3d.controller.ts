import {
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
import { NicknameValidationPipe } from 'src/common/pipes';
import {
    StandAvatar3DService,
    HeadAvatar3DService,
    ChibiAvatar3DService,
} from './services';
import { Avatar3DDto } from './dto/3d.dto';
import { IAvatar3DService, Avatar3DType } from './types/avatar.types';

@Controller('avatar/3d')
@UseInterceptors(CacheInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class Avatar3DController {
    private readonly services: ReadonlyMap<Avatar3DType, IAvatar3DService>;

    constructor(
        private readonly standAvatarService: StandAvatar3DService,
        private readonly headAvatarService: HeadAvatar3DService,
        private readonly chibiAvatarService: ChibiAvatar3DService,
    ) {
        this.services = new Map<Avatar3DType, IAvatar3DService>([
            ['stand', standAvatarService],
            ['head', headAvatarService],
            ['chibi', chibiAvatarService],
        ]) as ReadonlyMap<Avatar3DType, IAvatar3DService>;
    }

    @Get('stand/:nickname')
    async getStandAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size }: Avatar3DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('stand', nickname, size, res);
    }

    @Get('head/:nickname')
    async getHeadAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size }: Avatar3DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('head', nickname, size, res);
    }

    @Get('chibi/:nickname')
    async getChibiAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size }: Avatar3DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('chibi', nickname, size, res);
    }

    private async handleAvatarRequest(
        type: Avatar3DType,
        nickname: string,
        size: number,
        res: Response,
    ): Promise<void> {
        const service = this.services.get(type);
        if (!service) {
            res.status(404).send('Service not found');
            return;
        }

        const avatar = await service.get(nickname, size, false);

        res.setHeader('Content-Type', 'image/png')
            .setHeader(
                'Content-Disposition',
                `inline; filename="${type}_${nickname}.png"`,
            )
            .setHeader('Cache-Control', 'public, max-age=300')
            .send(avatar);
    }
}
