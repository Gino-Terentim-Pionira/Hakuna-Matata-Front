import api from '../services/api';
import { IUser } from '../recoil/useRecoilState';


async function UpdateStatus(
    user: IUser,
    userId: string,
    statusName: string,
    points: number
) {
    const currentStatus = user.status.find((item) => item.name == statusName);

    if (currentStatus) {
        const newPoints = currentStatus.points + points;
        await api.patch(`/user/status/${userId}`, {
            statusName: currentStatus.name,
            points: newPoints
        });
    }
}

export { UpdateStatus };