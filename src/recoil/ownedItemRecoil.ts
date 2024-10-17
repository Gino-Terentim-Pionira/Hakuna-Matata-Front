import { atom } from "recoil";
import { OwnedItemInfoType } from "../components/modals/InventoryModal/InventoryModal";

const ownedItemsState = atom({
    key: "ownedItemsState",
    default: [] as OwnedItemInfoType[]
});

export {
    ownedItemsState
}
