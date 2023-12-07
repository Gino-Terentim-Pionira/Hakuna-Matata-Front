import api from '../services/api';
import RelicsName from '../utils/enums/relics_name';


async function addRelic(
    owned_relics: string[], 
    relic: RelicsName,
    userId: string
) {
    if (!owned_relics.includes(relic)) {
        const response = await api.patch(`/user/addrelic/${userId}`, {
            relic_name: relic
        });
    
        return response;
    }
}

export { addRelic };
