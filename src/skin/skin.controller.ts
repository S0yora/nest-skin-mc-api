import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
import { SkinService } from './skin.service';
import { NicknameValidationPipe } from '../common/pipes/nickname.validation.pipe';

@Controller('skin')
@UseInterceptors(CacheInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class SkinController {
    constructor(private readonly skinService: SkinService) {}

    @Get(':nickname')
    async getSkin(
        @Param('nickname', new NicknameValidationPipe()) nickname: string,
        @Res() res: Response,
    ) {
        const { skin } = await this.skinService.getSkin(nickname);

        res.setHeader('Content-Type', 'image/png')
            .setHeader(
                'Content-Disposition',
                `inline; filename="skin_${nickname}.png"`,
            )
            .send(skin);
    }
}
