import { logger, LOG_TYPE } from "../tools/common";
import { ENV_LIST } from "../tools/constants";

interface IConfig {
    DEV: boolean,
    SERVER_URL: string,
    APP_PORT: string | number,
    HOST: string,
    DBNAME: string,
    USER: string,
    PASSWORD: string,
    DIALECT: string,
    pool: {
        max: number,
        min: number,
        acquire: number,
        idle: number
    }
    getAppBaseURL: () => string,
    getParsedURL: () => string
}

const conf: { [type: string]: IConfig } = {
    production: {
        DEV: false,
        SERVER_URL: "rifugi.cai.it",
        APP_PORT: process.env.PORT || 8000,
        HOST: process.env.HOST || 'localhost',
        DBNAME: process.env.DBNAME || 'CaiDB',
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DIALECT: process.env.DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        getAppBaseURL: function () {
            return 'http://' + this.SERVER_URL
        },
        getParsedURL: function () {
            return encodeURIComponent(this.getAppBaseURL() + '/j_spring_cas_security_check')
        }
    },
    default: {
        DEV: true,
        SERVER_URL: "localhost:",
        APP_PORT: process.env.PORT || 8000,
        HOST: process.env.HOST || 'localhost',
        DBNAME: process.env.DBNAME || 'CaiDB',
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DIALECT: process.env.DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        getAppBaseURL: function () {
            return 'http://' + this.SERVER_URL + this.APP_PORT
        },
        getParsedURL: function () {
            return encodeURIComponent(this.getAppBaseURL() + '/j_spring_cas_security_check')
        }
    },
    heroku: {
        DEV: true,
        SERVER_URL: "app-cai2.herokuapp.com",
        APP_PORT: process.env.PORT,
        HOST: process.env.HOST,
        DBNAME: process.env.DBNAME || 'CaiDB',
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DIALECT: process.env.DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        getAppBaseURL: function () {
            return 'http://' + this.SERVER_URL
        },
        getParsedURL: function () {
            return encodeURIComponent(this.getAppBaseURL() + '/j_spring_cas_security_check')
        }
    },
    test: {
        DEV: true,
        SERVER_URL: "localhost:",
        APP_PORT: 8000,
        HOST: process.env.HOST || 'localhost',
        DBNAME: process.env.DBNAME || 'CaiDB',
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DIALECT: process.env.DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        getAppBaseURL: function () {
            return 'http://' + this.SERVER_URL + this.APP_PORT
        },
        getParsedURL: function () {
            return encodeURIComponent(this.getAppBaseURL() + '/j_spring_cas_security_check')
        }
    }
}

export function checkEnvList(): boolean {
    return ENV_LIST.reduce((acc, val) => {
        return acc && process.env[val] != null;
    }, true);
}

export function getConfig(env: string): IConfig {
    const confType = env ? env.toLowerCase() : "default";
    const c = conf[confType];
    if (c) {
        logger(LOG_TYPE.INFO, "USING CONFIGURATION: " + confType);
        return c;
    } else {
        throw new Error("CONFIGURATION ERROR ON CONFIGURATION: " + confType);
    }
}
export const ENV_CONFIG = getConfig(process.env.NODE_ENV);
