import api from "./api";

class ShopService {
    getShopItems = async (userId: string) => {
        return await api.get(`/shopItem/${userId}`);
    }
}

export default new ShopService()
