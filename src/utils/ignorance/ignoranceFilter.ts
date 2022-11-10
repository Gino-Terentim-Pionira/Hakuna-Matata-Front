const ignoranceFilter = (ignorance: number, imageArray: string[]) => {
    if (ignorance > 75) {
        return imageArray[0];
    } else if (ignorance > 50) {
        return imageArray[1];
    } else if (ignorance > 25) {
        return imageArray[2];
    } else if (ignorance > 0) {
        return imageArray[3];
    }
    return "";
}

export default ignoranceFilter;