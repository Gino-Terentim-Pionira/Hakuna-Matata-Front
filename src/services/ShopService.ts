import api from "./api";

export interface IOwnedItems {
    name: string;
    description: string;
    type: 'normal';
    value: number;
    image: string;
    id_link: string;
    _id: string;
}
class ShopService {
    getShopItems = async (userId: string) => {
        return await api.get(`/shopItem/${userId}`);
    }

    buyShopItem = async (userId: string, shopItemId: string, usePremium: boolean) => {
        await api.post(`/shopItem/buy`, {
            userId,
            shopItemId,
            usePremium
        });
    }

    getOwnedItems = async (userId: string): Promise<IOwnedItems[]> => {
        const res = await api.get(`shopItem/inventory/${userId}`);
        return res.data
    }
}

export default new ShopService();

