const requestLoggerMiddlewareTemplate = () => {
    return `import logger from '../utils/logger.js'

const requestLogger = (req, res, next) => {
    const start = process.hrtime.bigint()

    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'

        logger.log(level, \`\${req.method} \${req.originalUrl} \${res.statusCode} - \${durationMs.toFixed(1)}ms\`)
    })

    next()
}

export default requestLogger`
}

export default requestLoggerMiddlewareTemplate;
