import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { Avatar2DType } from 'src/avatar/2d/types/avatar.types';

@Injectable()
export class AvatarTypeValidationPipe implements PipeTransform {
    transform(value: any): Avatar2DType {
        const allowedTypes: Avatar2DType[] = ['face', 'bust', 'torso', 'body'];
        if (!allowedTypes.includes(value))
            throw new NotFoundException(`Cannot GET /${value}`);

        return value;
    }
}
