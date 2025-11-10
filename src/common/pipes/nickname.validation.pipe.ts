import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NicknameValidationPipe implements PipeTransform {
    transform(value: any) {
        if (value.length < 3)
            throw new BadRequestException(
                'Nickname must be longer than or equal to 3 characters',
            );

        if (value.length > 16)
            throw new BadRequestException(
                'Nickname must be shorter than or equal to 16 characters',
            );

        return value;
    }
}
