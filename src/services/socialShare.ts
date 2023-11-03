import api from '../services/api';


async function verifySocialShare() {
    const shareType = localStorage.getItem('@pionira/shareType');
    const shareId = localStorage.getItem('@pionira/shareId');
    const plataform = localStorage.getItem('@pionira/plataform');
    const userId = sessionStorage.getItem('@pionira/userId');

    const response = await api.post(`/user/socialShare/${userId}`, {
        shareType,
        shareId,
        plataform
    });

    return response.data.validation;
}

export { verifySocialShare };
