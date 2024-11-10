const httpStatus = require('http-status')
const pick = require('../utils/pick')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const taskService = require('../services/task.service')

/**
 * Create a task
 */
const createTask = catchAsync(async (req, res) => {
    const body = req.body
    body.userId = req.user.id
    const task = await taskService.createTask(body)
    res.status(httpStatus.status.CREATED).send(task)
})

/**
 * Get all tasks
 */
const getTasks = catchAsync(async (req, res) => {
    // Get the user ID from the authenticated user
    const userId = req.user._id
    const filter = pick(req.query, [
        'title',
        'description',
        'dueDate',
        'categoryId',
        'isCompleted',
        'userId'
    ])
    // Add userId to the filter to ensure tasks are user-specific
    filter.userId = userId
    
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await taskService.queryTasks(filter, options)
    res.send(result)
})

/**
 * Get task by ID
 */
const getTask = catchAsync(async (req, res) => {
    const task = await taskService.getTaskById(req.params.taskId)
    if (!task) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Task not found')
    }
    res.send(task)
})

/**
 * Update a task
 */
const updateTask = catchAsync(async (req, res) => {
    const task = await taskService.updateTaskById(req.params.taskId, req.body)
    res.send(task)
})

/**
 * Delete a task
 */
const deleteTask = catchAsync(async (req, res) => {
    await taskService.deleteTaskById(req.params.taskId)
    res.status(httpStatus.status.OK).send({
        message: 'Task deleted successfully'
    })
})

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
}
