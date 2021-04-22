
require('dotenv').config();
import { ENV_CONFIG } from './config/env';
import { initServer } from './config/init';
import { LOG_TYPE, logger } from './tools/common';
import { app } from './config/app';

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(ENV_CONFIG.DBNAME, ENV_CONFIG.USER, ENV_CONFIG.PASSWORD, {
    host: ENV_CONFIG.HOST,
    dialect: ENV_CONFIG.DIALECT,
    operatorsAliases: false,
    pool: {
        max: ENV_CONFIG.pool.max,
        min: ENV_CONFIG.pool.min,
        acquire: ENV_CONFIG.pool.acquire,
        idle: ENV_CONFIG.pool.idle
    }
});
const closeServer = server => {
    server.close(function (err) {
        if (err) {
            logger(LOG_TYPE.ERROR, err);
            process.exit(2)
        }

        sequelize.close(function () {
            logger(LOG_TYPE.INFO, "Closed connections and exiting...");
            process.exit(0)
        })
    })
}

const setupStopINT = (server) => {
    process.on('SIGINT', () => {
        logger(LOG_TYPE.WARNING, 'SIGINT signal received');
        closeServer(server);
    });

    process.on('message', (msg) => {
        if (msg === 'shutdown') {
            logger(LOG_TYPE.WARNING, 'SHUTDOWN message received');
            closeServer(server);
        }
    })
}

const createServer = async () => {
    try {
        await sequelize.authenticate();
        logger(LOG_TYPE.INFO, "Connection db has been established successfully.");
    } catch (error) {
        logger(LOG_TYPE.ERROR, "Unable to connect to the database:", error);
    }

    let port = ENV_CONFIG.APP_PORT;
    app.set('port', port);

    const server = app.listen(ENV_CONFIG.APP_PORT, function () {
        port = (<any>server.address()).port;
        logger(LOG_TYPE.INFO, 'App now running on port', port);
    });
    /*mongoose.connect(ENV_CONFIG.MONGO_URI, function (err) {
        if (err) {
            if (i < 3) {
                logger(LOG_TYPE.ERROR, "CANNOT ESTABLISH CONNECTION. RETRY: ", i + 1)
                logger(LOG_TYPE.ERROR, 'Error mongo connection: ' + err);
                setTimeout(() => {
                    createServer(i + 1)
                }, 5 * 1000)
            } else {
                logger(LOG_TYPE.ERROR, "CANNOT ESTABLISH CONNECTION. CLOSE")
                process.exit(1)
            }
        } else {
            const server = app.listen(ENV_CONFIG.APP_PORT, function () {
                const port = (<any>server.address()).port;
                logger(LOG_TYPE.INFO, 'App now running on port', port);
            });
            setupStopINT(server);
        }
    });*/
}

if (initServer()) {
    createServer();
} else {
    logger(LOG_TYPE.ERROR, "INITIALIZATION FAILED");
}
