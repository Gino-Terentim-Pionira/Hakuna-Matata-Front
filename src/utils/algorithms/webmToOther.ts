export const webmToOther = (url: string, newFormat: string) => {
    const newURL = url.replace(/\.webm$/, newFormat);
    
    return newURL
}

export const webmOrMov = (url: string) => {
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android');

    return isSafari ? webmToOther(url, '.mov') : url;
}