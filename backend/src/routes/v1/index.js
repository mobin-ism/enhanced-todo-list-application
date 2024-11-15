const express = require('express')
const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const docsRoute = require('./docs.route')
const taskRoute = require('./task.route')
const categoryRoute = require('./category.route')
const config = require('../../config/config')

const router = express.Router()

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/categories',
        route: categoryRoute
    },
    {
        path: '/tasks',
        route: taskRoute
    },
    {
        path: '/users',
        route: userRoute
    }
]

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

/**
 * HIDE THE DOCS IN PRODUCTION
 *
 * @var {[type]}
 */
if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route)
    })
}

module.exports = router
