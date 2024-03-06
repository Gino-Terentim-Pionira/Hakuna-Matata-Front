export const getDateDifBetweenCurrentDateAnd = (otherDate: Date) => {
	const currentDate = new Date();
	const relicDate = new Date(otherDate);
	const currentDateMiliseconds = currentDate.getTime();
	const userEquipedRelicsDataMiliseconds = relicDate.getTime();
	return (currentDateMiliseconds - userEquipedRelicsDataMiliseconds) / 3600000;
}