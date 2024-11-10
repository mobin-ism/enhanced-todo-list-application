const Joi = require('joi')
const { objectId } = require('./custom.validation')

const createTask = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().allow(''), // Optional field, allows empty strings
        dueDate: Joi.date().iso(), // ISO 8601 date format
        categoryId: Joi.string().optional().custom(objectId), // Optional field, must be a valid ObjectId if provided
        userId: Joi.string().optional().custom(objectId), // Optional field, must be a valid ObjectId if provided
        priority: Joi.string().valid('high', 'medium', 'low').default('low') // Default value is 'low'
    })
}

const getTasks = {
    query: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string().allow(''),
        dueDate: Joi.date().iso(),
        isCompleted: Joi.boolean(),
        categoryId: Joi.string().optional().custom(objectId), // Optional field
        priority: Joi.string().valid('high', 'medium', 'low'), // Default value is 'low'
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
}

const getTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId) // Must be a valid ObjectId
    })
}

const updateTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            description: Joi.string().allow(''),
            dueDate: Joi.date().iso(),
            isCompleted: Joi.boolean().optional().default(false),
            categoryId: Joi.string().optional().custom(objectId), // Optional field
            priority: Joi.string()
                .optional()
                .valid('high', 'medium', 'low')
                .default('low') // Default value is 'low'
        })
        .min(1) // Ensure at least one field is being updated
}

const deleteTask = {
    params: Joi.object().keys({
        taskId: Joi.string().required().custom(objectId)
    })
}

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
}
