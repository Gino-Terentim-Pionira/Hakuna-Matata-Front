import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pionira-backend.onrender.com'
});

api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('@pionira/token');
    config.headers['authorization'] = token;
    
    return config;
});

export default api;
