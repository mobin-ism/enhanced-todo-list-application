const { version } = require('../../package.json')
const config = require('../config/config')

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'Enhanced Todo API documentation',
        version,
        license: {
            name: 'MIT',
            url: 'https://github.com/mobin-ism/enhanced-todo-list-application'
        }
    },
    servers: [
        {
            url: `http://localhost:${config.port}/v1`
        }
    ]
}

module.exports = swaggerDef
