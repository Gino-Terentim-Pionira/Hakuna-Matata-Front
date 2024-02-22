import api from './api';


export class UserServices {
    createUser = async (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
        birthday_date: string,
        userName: string
    ) => {
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

    getUserAvatar = async (_userId: string) => {
        return await api.get(`user/avatar/${_userId}`);
    }

    patchUserAvatar = async (
        _userId: string,
        custom_avatar: {
            hair: string;
            hair_color: string;
            facial_hair: string;
            clothes: string;
            eyes: string;
            eyebrow: string;
            mouth: string;
            skin: string
        }
    ) => {
        await api.patch(`/user/avatar/${_userId}`, { custom_avatar });
    }

    equipUserRelic = async (_userId: string, relic_name: string) => {
        await api.patch(`/user/equiprelic/${_userId}`, {
            relic_name
        });
    }

    unequipUserRelic = async (_userId: string, relicSlot: 'first_slot' | 'second_slot') => {
        await api.patch(`/user/unequiprelic/${_userId}`, {
            relicSlot
        })
    }
}
