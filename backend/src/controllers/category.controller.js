const httpStatus = require('http-status')
const pick = require('../utils/pick')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const categoryService = require('../services/category.service')

const createCategory = catchAsync(async (req, res) => {
    const body = req.body
    body.userId = req.user.role === 'admin' ? null : req.user.id
    const category = await categoryService.createCategory(body)
    res.status(httpStatus.status.CREATED).send(category)
})

const getCategories = catchAsync(async (req, res) => {
    // Get the user ID from the authenticated user
    const userId = req.user._id
    const filter = pick(req.query, ['name'])

    // Ensure the filter considers userId match or null
    filter.$or = [{ userId }, { userId: null }]

    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await categoryService.queryCategories(filter, options)
    res.send(result)
})

const getCategory = catchAsync(async (req, res) => {
    // Get the user ID from the authenticated user
    const userId = req.user._id
    const category = await categoryService.getCategoryById(
        req.params.categoryId,
        userId
    )
    if (!category) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Category not found')
    }
    res.send(category)
})

const updateCategory = catchAsync(async (req, res) => {
    const category = await categoryService.updateCategoryById(
        req.params.categoryId,
        req.body
    )
    res.send(category)
})

const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategoryById(req.params.categoryId)
    res.status(httpStatus.status.OK).send({
        message: 'Category deleted successfully'
    })
})

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}
