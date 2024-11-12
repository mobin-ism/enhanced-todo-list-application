const httpStatus = require('http-status')
const Task = require('../models/task.model')
const ApiError = require('../utils/ApiError')

/**
 * Create a task
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (taskBody) => {
    const createdTask = await Task.create(taskBody)
    return await getTaskById(createdTask.id, createdTask.userId)
}

/**
 * Query for tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTasks = async (filter, options) => {
    // If there's a title in the filter, convert it to a case-insensitive regex pattern
    if (filter.title) {
        filter.title = {
            $regex: filter.title,
            $options: 'i' // 'i' flag makes it case insensitive
        }
    }

    const tasks = await Task.paginate(filter, {
        ...options,
        populate: 'categoryId'
    })
    return tasks
}

/**
 * Get task by id
 * @param {ObjectId} id
 * @returns {Promise<Task>}
 */
const getTaskById = async (id, userId) => {
    return Task.findOne({
        _id: id,
        $or: [{ userId }]
    }).populate('categoryId')
}

/**
 * Update task by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Task>}
 */
const updateTaskById = async (taskId, updateBody, userId) => {
    const task = await getTaskById(taskId, userId)
    if (!task) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Task not found')
    }
    Object.assign(task, updateBody)
    await task.save()
    return task
}

/**
 * Delete task by id
 * @param {ObjectId} taskId
 * @returns {Promise<Task>}
 */
const deleteTaskById = async (taskId, userId) => {
    const task = await getTaskById(taskId, userId)
    if (!task) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Task not found')
    }
    await task.deleteOne()
    return task
}

module.exports = {
    createTask,
    queryTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById
}
