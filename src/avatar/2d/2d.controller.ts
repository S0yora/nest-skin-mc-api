import {
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors,
    Res,
    UsePipes,
    ValidationPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
import {
    AvatarTypeValidationPipe,
    NicknameValidationPipe,
} from 'src/common/pipes';
import { Avatar2DDto } from './dto/2d.dto';
import {
    FaceAvatar2DService,
    BustAvatar2DService,
    TorsoAvatar2DService,
    BodyAvatar2DService,
} from './services';
import { Avatar2DType, IAvatar2DService } from './types/avatar.types';

@Controller('avatar/2d')
@UseInterceptors(CacheInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class Avatar2DController {
    private readonly services: ReadonlyMap<Avatar2DType, IAvatar2DService>;

    constructor(
        private readonly faceService: FaceAvatar2DService,
        private readonly bustService: BustAvatar2DService,
        private readonly torsoService: TorsoAvatar2DService,
        private readonly bodyService: BodyAvatar2DService,
    ) {
        this.services = new Map<Avatar2DType, IAvatar2DService>([
            ['face', faceService],
            ['bust', bustService],
            ['torso', torsoService],
            ['body', bodyService],
        ]) as ReadonlyMap<Avatar2DType, IAvatar2DService>;
    }

    @Get('face/:nickname')
    async getFaceAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size, overlay }: Avatar2DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('face', nickname, size, overlay, res);
    }

    @Get('bust/:nickname')
    async getBustdAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size, overlay }: Avatar2DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('bust', nickname, size, overlay, res);
    }

    @Get('torso/:nickname')
    async getTorsoAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size, overlay }: Avatar2DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('torso', nickname, size, overlay, res);
    }

    @Get('body/:nickname')
    async getBodyAvatar(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
        @Query() { size, overlay }: Avatar2DDto,
    ): Promise<void> {
        return this.handleAvatarRequest('body', nickname, size, overlay, res);
    }

    private async handleAvatarRequest(
        type: Avatar2DType,
        nickname: string,
        size: number,
        overlay: boolean,
        res: Response,
    ): Promise<void> {
        const service = this.services.get(type);
        if (!service) {
            res.status(404).send('Service not found');
            return;
        }

        const avatar = await service.get(nickname, size, overlay);

        res.setHeader('Content-Type', 'image/png')
            .setHeader(
                'Content-Disposition',
                `inline; filename="${type}_${nickname}.png"`,
            )
            .setHeader('Cache-Control', 'public, max-age=300')
            .send(avatar);
    }
}
