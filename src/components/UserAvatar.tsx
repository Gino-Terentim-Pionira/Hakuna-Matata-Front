
import Avatar from 'avataaars';
import React from 'react';

interface UserAvatarInterface {
    width?: string;
    height?: string;
    customAvatar: {
        hair: string;
        hair_color: string;
        facial_hair: string;
        clothes: string;
        eyes: string;
        eyebrow: string;
        mouth: string;
        skin: string;
    }
    avatarStyle?: 'Circle' | 'Transparent'
}

const UserAvatar = ({ avatarStyle = 'Circle', customAvatar, width = '160px', height = '160px' }: UserAvatarInterface) => (<Avatar
    avatarStyle={avatarStyle}
    topType={customAvatar.hair}
    accessoriesType='Blank'
    hairColor={customAvatar.hair_color}
    facialHairType={customAvatar.facial_hair}
    facialHairColor={customAvatar.hair_color}
    clotheType={customAvatar.clothes}
    eyeType={customAvatar.eyes}
    eyebrowType={customAvatar.eyebrow}
    mouthType={customAvatar.mouth}
    skinColor={customAvatar.skin}
    style={{
        width,
        height
    }}
/>
)

export default UserAvatar;
