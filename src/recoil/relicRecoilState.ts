import { atom } from "recoil";
import rarityEnum from "../utils/enums/rarity";

export interface IRelic {
    _id: string;
    relic_name: string;
    description: string;
    hint: string;
    rarity: rarityEnum;
    image: string;
    image_sillouete: string;
}

const relicState = atom({
    key: "relicState",
    default: [] as IRelic[]
});

export {
    relicState
};