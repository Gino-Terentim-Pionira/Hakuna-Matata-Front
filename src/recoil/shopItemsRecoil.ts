import { atom } from "recoil";
import { ShopItemInfoType } from "../components/modals/ShopModal/ShopModal";

const shopItemsState = atom({
    key: "shopItemsState",
    default: {} as ShopItemInfoType[]
});

export {
    shopItemsState
}
