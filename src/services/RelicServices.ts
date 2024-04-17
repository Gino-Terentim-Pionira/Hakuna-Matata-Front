import api from '../services/api';
import RelicsName from '../utils/enums/relicsName';
import { IUser } from '../recoil/useRecoilState';


class RelicServices {
    async addRelic(
        owned_relics: IUser['user_relics'],
        relic: RelicsName,
        userId: string
    ) {
        const findRelic = owned_relics.find(item => item.relic_name === relic)
        if (!findRelic) {
            const response = await api.patch(`/user/addrelic/${userId}`, {
                relic_name: relic
            });

            return response;
        }
    }

    async checkAllRelics(userId: string) {
        try {
            return  await api.get(`/relic/checkrelics/${userId}`);
        } catch (e) {
            return []
        }
    }
}


export default RelicServices;
