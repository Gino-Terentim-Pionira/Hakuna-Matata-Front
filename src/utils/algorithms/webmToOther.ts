export const webmToOther = (url: string, newFormat: string) => {
    const newURL = url.replace(/\.webm$/, newFormat);
    
    return newURL
}