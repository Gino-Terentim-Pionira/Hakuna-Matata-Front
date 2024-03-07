import api from '../services/api';
import RelicsName from '../utils/enums/relicsName';
import { IUser } from '../recoil/useRecoilState';


async function addRelic(
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

export { addRelic };
