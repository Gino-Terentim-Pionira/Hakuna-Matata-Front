import RelicServices from '../services/RelicServices';

export const useCheckAllRelics = () => {
	const isChecked = sessionStorage.getItem("@pionira/isChecked");
	const userId = sessionStorage.getItem("@pionira/userId");

	const checkUserAllRelics = async () => {
		try {
			if(isChecked || !userId) return [];
			const relicServices = new RelicServices();
            sessionStorage.setItem("@pionira/isChecked", "true");

			return await relicServices.checkAllRelics(userId);
		} catch (e) {
			return [];
		}
	}

	return {
		checkUserAllRelics,
	}
}
