import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class Avatar3DDto {
    @IsOptional()
    @IsInt()
    @Min(32)
    @Max(512)
    @Type(() => Number)
    size: number = 256;
}
