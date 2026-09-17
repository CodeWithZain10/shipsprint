const loggerTemplate = () => {
    return `import winston from 'winston'

const { combine, timestamp, colorize, printf, json, errors } = winston.format

const devFormat = printf(({ level, message, timestamp, stack }) => {
    return \`\${timestamp} [\${level}] \${stack || message}\`
})

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production'
        ? combine(timestamp(), errors({ stack: true }), json())
        : combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), devFormat),
    transports: [
        new winston.transports.Console({
            silent: process.env.NODE_ENV === 'test'
        })
    ]
})

export default logger`
}

export default loggerTemplate;
