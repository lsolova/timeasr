import express from 'express';
import path from 'path';

const app = express();

const defaultAppConfig = {
    ip: '127.0.0.1',
    port: 8080
};

function getAppConfigForEnvironment(envName) {
    let appEnvConfig;
    switch (envName) {
        case 'heroku':
            appEnvConfig = Object.assign({}, defaultAppConfig, {
                ip: null,
                port: process.env.PORT
            });
            break;
        case 'openshift':
            appEnvConfig = Object.assign({}, defaultAppConfig, {
                ip: process.env.OPENSHIFT_NODEJS_IP,
                port: process.env.OPENSHIFT_NODEJS_PORT
            });
            break;
        default:
            appEnvConfig = Object.assign({}, defaultAppConfig);
            break;
    }
    return appEnvConfig;
}

(function start(rootDir) {
    if (!process.env.SLVENV) {
        console.error('Environment unknown.'); // eslint-disable-line no-console
        return;
    }
    const serverRootDir = path.resolve(rootDir, 'dist');
    const appConfig = getAppConfigForEnvironment(process.env.SLVENV);
    app.use('/', express.static(serverRootDir));
    app.listen(appConfig.port, appConfig.ip);
}(process.env.PWD || __dirname));
