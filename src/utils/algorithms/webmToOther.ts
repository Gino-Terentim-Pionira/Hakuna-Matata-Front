export const webmToOther = (url: string, newFormat: string) => {
    const newURL = url.replace(/\.webm$/, newFormat);
    
    return newURL
}

export const webmToMP4 = (url: string) => { 
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari =  /^((?!chrome|android).)*safari/.test(userAgent);

    if (isSafari) {
        return webmToOther(url, '.mp4');
    } else {
        return url;
    }
}