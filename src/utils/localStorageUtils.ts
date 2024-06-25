
export enum trailAccessEnum {
    CHEETAH = 'cheetah_access',
    LION = 'lion_access'
};

export const getItemLocalStorage = (name: string) => {
    return localStorage.getItem(`@pionira/${name}`);
};

export const setItemLocalStorage = (name: string, value: string) => {
   localStorage.setItem(`@pionira/${name}`, value);
};

export const getTrailAccess = (trail: trailAccessEnum) => {
    return getItemLocalStorage(trail);
}

export const setTrailAccess = (trail: trailAccessEnum, value: string) => {
    setItemLocalStorage(trail, value);
}
