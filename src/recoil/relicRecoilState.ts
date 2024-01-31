import { atom } from "recoil";
import rarityEnum from "../utils/enums/rarity";

export type RelicType = {
    _id: string,
    hint: string,
    rarity: rarityEnum,
    image_sillouete: string,
    relic_name: string,
    image: string,
}

export type UserRelicType = {
    _id: string,
    relic_name: string,
    description: string,
    rarity: rarityEnum,
    image: string;
    path: string;
}

export interface IRelic {
    relics?: RelicType[];
    user_relics?: UserRelicType[]
}

const relicState = atom({
    key: "relicState",
    default: {} as IRelic
});

export {
    relicState
};