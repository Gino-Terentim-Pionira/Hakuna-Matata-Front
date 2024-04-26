import api from './api';

export async function SignIn(email: string, password: string) {
    const res = await api.post("/user/login", {
        email,
        password
    });
    return res.data;
}