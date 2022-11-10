import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pionira-backend.onrender.com'
});

export default api;