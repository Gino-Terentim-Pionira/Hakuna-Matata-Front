import { Text, Center } from '@chakra-ui/react';
import ModuleModal from '../components/modals/ModuleModal';
import React, { SetStateAction, useEffect, useState } from 'react';
import api from '../services/api';

interface IUser {
    ignorance: number;
    _id: string;
    userName: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthday_date: string;
    is_confirmed: boolean;
    status: [number];
    coins: number;
    contribution: number;
    first_certificate: string;
    second_certificate: string;
    isFirstTimeAppLaunching: boolean;
    narrative_status: {
        trail1: number,
        trail2: number
    };
}

const LionPath = () => {
	const [difficultyIndex, setDifficultyIndex] = useState<number>(0);
	const [user, setUser] = useState<IUser>({} as IUser);

	const getUserData = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
        const res = await api.get(`/user/${_userId}`);
        setUser(res.data);
	}

	const chooseFinalLionPath = () => {
		if (user.ignorance >= 80) {
			setDifficultyIndex(1);
		} else if (user.ignorance >= 40 && user.ignorance < 80) {
			setDifficultyIndex(2);
		} else {
			setDifficultyIndex(3);
		}
	}

	useEffect(() => {
		getUserData();
		chooseFinalLionPath();
	}, []);

	return (
		<>
			<Text textAlign='center' fontSize='3.5rem'>
				Final Lion
			</Text>
			<Center>
				<ModuleModal quizIndex={difficultyIndex} />
			</Center>
		</>
	);
};

export default LionPath;
