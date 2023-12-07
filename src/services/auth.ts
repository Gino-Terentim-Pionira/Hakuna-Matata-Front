import axios from 'axios';
import api from './api';

export async function SignIn(email: string, password: string) {
    try {
        const res = await api.post("/user/login", {
            email,
            password
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return error.response.data.error;
            }
        }
    }
}