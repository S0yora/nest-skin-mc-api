interface IProfileUUID {
    id: string;
    name: string;
}

interface IProfileData {
    id: string;
    name: string;
    properties: {
        name: 'textures';
        value: string;
    }[];
}

interface ISkin {
    skin: Buffer;
    slim: boolean;
}

interface IProfileTextures {
    textures: {
        SKIN: {
            url: string;
            metadata?: {
                model: 'slim';
            };
        };
    };
}

export { IProfileUUID, IProfileData, ISkin, IProfileTextures };
