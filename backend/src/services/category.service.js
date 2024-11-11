const httpStatus = require('http-status')
const Category = require('../models/category.model')
const ApiError = require('../utils/ApiError')

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
    /*
    if (await Category.isNameTaken(categoryBody.name)) {
        throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            'Category name already taken'
        )
    }
    */
    return Category.create(categoryBody)
}

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
    const categories = await Category.paginate(filter, options)
    return categories
}

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id, userId) => {
    return Category.findOne({
        _id: id,
        $or: [{ userId }, { userId: null }]
    })
}

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
    const category = await getCategoryById(categoryId)
    if (!category) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Category not found')
    }
    /*
    if (
        updateBody.name &&
        (await Category.isNameTaken(updateBody.name, categoryId))
    ) {
        throw new ApiError(
            httpStatus.status.BAD_REQUEST,
            'Category name already taken'
        )
    }
    */
    Object.assign(category, updateBody)
    await category.save()
    return category
}

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
    const category = await getCategoryById(categoryId)
    if (!category) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Category not found')
    }
    await category.deleteOne()
    return category
}

module.exports = {
    createCategory,
    queryCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}
