import { atom } from "recoil";
import { ShopItemInfoType } from "../components/modals/ShopModal/ShopModal";

export type ItemType = 'normal' | 'especial' | 'oracle' | 'certificate'

const shopItemsState = atom({
    key: "shopItemsState",
    default: [] as ShopItemInfoType[]
});

export {
    shopItemsState
}
