import axios from 'axios';

const api = axios.create({
    baseURL: 'https://us-central1-pionira-backend-e09bd.cloudfunctions.net/app'
});

api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('@pionira/token');
    config.headers['authorization'] = token;
    
    return config;
});

export default api;
