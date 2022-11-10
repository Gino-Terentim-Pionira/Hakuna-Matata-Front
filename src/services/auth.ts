import api from './api';

export async function SignIn(email: string, password: string) {
    try {
        const res = await api.post("/user/login", {
            email,
            password
        });
        return res.data;
    } catch (error) {
        return error.response.data.error;
    }
}