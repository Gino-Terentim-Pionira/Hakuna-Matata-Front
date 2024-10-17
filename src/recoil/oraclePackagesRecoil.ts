import { atom } from "recoil";
import { ShopItemInfoType } from "../components/modals/ShopModal/ShopModal";

const oraclePackageState = atom({
    key: "oraclePackageState",
    default: [] as ShopItemInfoType[]
});

export {
    oraclePackageState
}
