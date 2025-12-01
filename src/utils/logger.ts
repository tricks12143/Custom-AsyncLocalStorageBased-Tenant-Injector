import transports from "winston/lib/winston/transports/";
const {createLogger, format} = require('winston');
const {als} = require('./context');

// Logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({message}: {message: string}) => {
            const store = als.getStore();
            const reqId = store?.reqId || 'no-id';
            return `[reqId=${reqId}] ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
    ]
});

export {logger};