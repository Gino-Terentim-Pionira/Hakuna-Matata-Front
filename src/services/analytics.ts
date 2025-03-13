declare global {
    interface Window {
        gtag?: (command: 'config' | 'event', eventName: string, params?: GtagEventParams) => void;
    }
}

interface GtagEventParams {
    'value': string;
}


const env = process.env.REACT_APP_ENV;

export const trackEvent = (action: string, value: string) => {
    if (window.gtag && env == 'prod') {
        window.gtag('event', action, {
            'value': value
        });
    }
}