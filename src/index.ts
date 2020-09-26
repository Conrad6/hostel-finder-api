import { Logger } from '@overnightjs/logger';
import { config as dotEnvConfig } from 'dotenv';
import { ioc, TYPES } from './init';
import { MainServer } from './server';
if (process.env.NODE_ENV?.trim() === 'development') {
    console.log('test1');
    if (dotEnvConfig({ path: `${process.cwd()}\\.development.env` }).error) {
        process.exit(1);
    }
} else {
    if (dotEnvConfig({ path: `${process.cwd()}\\.env` }).error) {
        process.exit(1);
    }
}


const init = () => {
    const server = ioc.get<MainServer>(TYPES.mainServer).app.listen(parseInt(process.env.SERVER_PORT?.trim() || '3000', 10), process.env.SERVER_HOST?.trim() || 'localhost', () => Logger.Imp(`Listening on... ${process.env.SERVER_PORT}`));
};

init();