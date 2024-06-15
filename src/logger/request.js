const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
      timestamp(),
      logFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/app.log' })
    ]
});

module.exports = (req, res, next) => {
    const { method, url } = req;
    const start = Date.now();
    
    res.on('finish', () => {
        const { statusCode } = res;
        const duration = Date.now() - start;
        const message = `${method} ${url} ${statusCode} ${duration}ms`;
        
        if (statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });
  
    next();
}