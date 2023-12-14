import api from '../services/api';
import RelicsName from '../utils/enums/relics_name';


async function addRelic(
    owned_relics: [{
		relic_name: string,
		date: Date
	}], 
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
