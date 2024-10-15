import { atom } from "recoil";
import { ShopItemInfoType } from "../components/modals/ShopModal/ShopModal";

const certificatesState = atom({
    key: "certificatesState",
    default: [] as ShopItemInfoType[]
});

export {
    certificatesState
}
