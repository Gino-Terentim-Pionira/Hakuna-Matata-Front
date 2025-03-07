declare global {
    interface Window {
        gtag?: (command: 'config' | 'event', eventName: string, params?: GtagEventParams) => void;
    }
}

interface GtagEventParams {
    event_category: string;
    event_label?: string;
    value?: number;
}


const env = process.env.REACT_APP_ENV;

export const trackEvent = (action: string, category: string, label: string) => {
    if (window.gtag && env == 'prod') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}