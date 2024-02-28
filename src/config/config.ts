import productionConfig from './prod';
import stagingConfig from './stage';
import devConfig from './dev';

const env = process.env.REACT_APP_ENV;

let apiUrl;

switch (env) {
    case 'prod':
        apiUrl = productionConfig.apiUrl;
        break;

    case 'stage':
        apiUrl = stagingConfig.apiUrl;
        break;
    
    case 'dev':
        apiUrl = devConfig.apiUrl;
        break;
}

export default apiUrl as string;
