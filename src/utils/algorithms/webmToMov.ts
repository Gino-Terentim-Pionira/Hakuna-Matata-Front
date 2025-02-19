export const webmToMov = (url: string) => {
    const newURL = url.replace(/\.webm$/, '.mov');
    
    return newURL
}