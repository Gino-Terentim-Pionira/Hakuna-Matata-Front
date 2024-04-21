import productionConfig from './prod';
import stagingConfig from './stage';
import devConfig from './dev';

const env = process.env.REACT_APP_ENV;

const apiUrl = {
    ['prod'] : productionConfig.apiUrl,
    ['stage']: stagingConfig.apiUrl,
    ['dev']: devConfig.apiUrl,
};

export default apiUrl[env as 'prod' | 'stage' | 'dev'] as string;
