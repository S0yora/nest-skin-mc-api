export type Avatar3DType = 'stand' | 'head' | 'chibi';

export interface IAvatar3DService {
    get(nickname: string, size: number, overlay: boolean): Promise<Buffer>;
}
