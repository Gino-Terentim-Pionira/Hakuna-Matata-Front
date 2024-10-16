import { atom } from "recoil";
import { OwnedItemInfoType } from "../components/modals/InventoryModal/InventoryModal";

const ownedCertificatesState = atom({
    key: "ownedCertificatesState",
    default: [] as OwnedItemInfoType[]
});

export {
    ownedCertificatesState
}
