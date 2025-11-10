import { Module } from '@nestjs/common';
import { Avatar3DModule } from './3d/3d.module';
import { Avatar2DModule } from './2d/2d.module';

@Module({
    imports: [Avatar2DModule, Avatar3DModule],
    controllers: [],
    providers: [],
})
export class AvatarModule {}
