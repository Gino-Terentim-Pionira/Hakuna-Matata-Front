import { SetStateAction } from "react";
import { useRecoilState } from "recoil"
import { shopItemsState } from "../recoil/shopItemsRecoil";
import shopService from "../services/ShopService";

export const useShopItems = () => {
    const [shopItemsData, setShopItemsData] = useRecoilState(shopItemsState);

    const getNewShopItems = async () => {
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );

        const res = await shopService.getShopItems(_userId as string);
        const newResponse = res.data.map((item: {name: string, description: string, image: string, type: string, value: number}) => ({
            title: item.name,
            description: item.description,
            image: item.image,
            type: item.type,
            price: String(item.value)
        }));

        setShopItemsData(newResponse);
    }

    return {
        shopItemsData,
        getNewShopItems
    }
}

export default useShopItems;
