import { atom } from "recoil";
import rarityEnum from "../utils/enums/rarity";

export interface IRelic {
    relics?: [{
        _id: string,
        hint: string,
        rarity: string,
        image_sillouete: string,
    }];
    user_relics?: [{
        _id: string,
        relic_name: string,
        description: string,
        rarity: string,
        image: string;
    }]
}

const relicState = atom({
    key: "relicState",
    default: {} as IRelic
});

export {
    relicState
};