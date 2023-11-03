import api from '../services/api';


async function getLogInUrl() {
    const response = await api.get(`/linkedin/login`);

    return response;
};

async function share(
    code: string
) {
    const text = localStorage.getItem('@pionira/linkedin_text');
    const imgDescription = localStorage.getItem('@pionira/linkedin_description');
    const imgData = localStorage.getItem('@pionira/linkedin_img');
    const response = await api.post(`/linkedin/shareLinkedin`, {
        code,
        text,
        imgDescription,
        imgData
    });

    return response;
};

function setItems(
    text: string,
    description: string,
    img: string,
    shareType: string,
    shareId: string,
    plataform: string
) {
    localStorage.setItem('@pionira/linkedin_text', text);
    localStorage.setItem('@pionira/linkedin_description', description);
    localStorage.setItem('@pionira/linkedin_img', img);
    localStorage.setItem('@pionira/shareType', shareType);
    localStorage.setItem('@pionira/shareId', shareId);
    localStorage.setItem('@pionira/plataform', plataform);
}

export { getLogInUrl, share, setItems };
