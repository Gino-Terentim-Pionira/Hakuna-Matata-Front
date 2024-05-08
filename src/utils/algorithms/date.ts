export const getDateDifBetweenCurrentDateAnd = (otherDate: Date) => {
	const currentDate = new Date();
	const relicDate = new Date(otherDate);
	const currentDateMiliseconds = currentDate.getTime();
	const userEquipedRelicsDataMiliseconds = relicDate.getTime();
	return (currentDateMiliseconds - userEquipedRelicsDataMiliseconds) / 3600000;
}

export const verifyIsDayTime = () => {
	const currentDate = new Date();
	const hour = currentDate.getHours();
	const minutes = currentDate.getMinutes();
	const currentSeconds = hour * 3600 + minutes * 60;

	if (currentSeconds >= 25200 && currentSeconds < 66600) {
		return true;
	} else {
		return false;
	}
}