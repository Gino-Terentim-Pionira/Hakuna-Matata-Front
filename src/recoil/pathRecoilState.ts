import { atom } from "recoil";

const pathState = atom({
    key: "pathInfo",
    default: ""
});

export { pathState }
