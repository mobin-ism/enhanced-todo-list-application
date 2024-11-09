const Joi = require('joi')
const { objectId } = require('./custom.validation')

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string()
    })
}

const getCategories = {
    query: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
}

const getCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId)
    })
}

const updateCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            description: Joi.string()
        })
        .min(1) // Ensure at least one field is being updated
}

const deleteCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId)
    })
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}
