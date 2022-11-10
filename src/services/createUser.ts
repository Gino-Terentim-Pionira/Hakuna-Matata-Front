import api from '../services/api';


async function CreateUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    birthday_date: string,
    userName: string
) {
    await api.post("/user/", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        birthday_date: birthday_date,
        userName: userName,
        firstAccessDate: new Date()
    });
}

export { CreateUser };