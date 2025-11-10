import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class Avatar2DDto {
    @IsOptional()
    @IsInt()
    @Min(8)
    @Max(256)
    @Type(() => Number)
    size: number = 64;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    overlay: boolean = true;
}
