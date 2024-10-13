import api from "./api";

class ShopService {
    getShopItems = async (userId: string) => {
        return await api.get(`/shopItem/${userId}`);
    }

    buyShopItem = async (userId: string, shopItemId: string) => {
        await api.post(`/shopItem/buy`, {
            userId,
            shopItemId
        });
    }
}

export default new ShopService()
