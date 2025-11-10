import {
    Injectable,
    Logger,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, map } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { Buffer } from 'node:buffer';
import {
    ISkin,
    IProfileData,
    IProfileUUID,
    IProfileTextures,
} from './skin.types';

@Injectable()
export class SkinService {
    private readonly logger = new Logger(SkinService.name);

    private readonly GET_PROFILE_ID =
        'https://api.mojang.com/users/profiles/minecraft/';
    private readonly GET_PROFILE_DATA =
        'https://sessionserver.mojang.com/session/minecraft/profile/';

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly httpService: HttpService,
    ) {}

    private async getProfileUUID(nickname: string): Promise<string> {
        const cacheKey = `profile_uuid:${nickname}`;
        const cachedSkin = await this.cacheManager.get<string>(cacheKey);
        if (cachedSkin) return cachedSkin;

        const url = this.GET_PROFILE_ID + nickname;

        const { id } = await firstValueFrom(
            this.httpService.get<IProfileUUID>(url).pipe(
                map((res) => res.data),
                catchError((error: AxiosError) => {
                    this.logger.error(error);
                    throw new BadRequestException(`Bad request get profile id`);
                }),
            ),
        );

        if (!id) throw new NotFoundException(`Profile "${nickname}" not found`);

        await this.cacheManager.set(cacheKey, id);
        return id;
    }

    private async getProfileSkinData(
        profileUUID: string,
    ): Promise<IProfileTextures['textures']['SKIN']> {
        const url = this.GET_PROFILE_DATA + profileUUID;
        const { data } = await firstValueFrom(
            this.httpService.get<IProfileData>(url).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error);
                    throw new BadRequestException(
                        `Bad request get profile data`,
                    );
                }),
            ),
        );

        const { textures } = this.decodeBase64(data);

        return textures.SKIN;
    }

    private decodeBase64(profileData: IProfileData): IProfileTextures {
        const textureProperty = profileData.properties.find(
            ({ name }) => name === 'textures',
        );

        if (!textureProperty) {
            throw new BadRequestException(
                'Texture property not found in profile data',
            );
        }

        const decoded: IProfileTextures = JSON.parse(
            Buffer.from(textureProperty.value, 'base64').toString('utf-8'),
        );

        return decoded;
    }

    async getSkin(nickname: string): Promise<ISkin> {
        const cacheKey = `skin:${nickname}`;
        const cachedSkin = await this.cacheManager.get<ISkin>(cacheKey);
        if (cachedSkin) return cachedSkin;

        const profileUUID = await this.getProfileUUID(nickname);
        const { url, metadata } = await this.getProfileSkinData(profileUUID);

        const skinImage: AxiosResponse<Buffer> = await firstValueFrom(
            this.httpService.get(url, { responseType: 'arraybuffer' }).pipe(
                catchError((error) => {
                    this.logger.error(error);
                    throw new BadRequestException('Bad request get skin');
                }),
            ),
        );
        const skinBuffer = Buffer.from(skinImage.data);
        const cacheSkinValue = {
            skin: skinBuffer,
            slim: !!metadata?.model,
        };

        await this.cacheManager.set(cacheKey, cacheSkinValue);

        return cacheSkinValue;
    }
}
