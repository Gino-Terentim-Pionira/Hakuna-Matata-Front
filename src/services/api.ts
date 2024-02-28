import axios from 'axios';
import apiUrl from '../config/config'

const api = axios.create({
    baseURL: apiUrl
});

api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('@pionira/token');
    config.headers['authorization'] = token;
    
    return config;
});

export default api;
