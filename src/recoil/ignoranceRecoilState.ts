import { atom } from "recoil";

const useIgnoranceFilterState = atom({
	key: "ignoranceInfo",
	default: false
});


export {
	useIgnoranceFilterState,
};
