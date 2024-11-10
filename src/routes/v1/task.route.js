const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const taskValidation = require('../../validations/task.validation')
const taskController = require('../../controllers/task.controller')

const router = express.Router()

router
    .route('/')
    .post(
        auth('manageTasks'),
        validate(taskValidation.createTask),
        taskController.createTask
    )
    .get(
        auth('getTasks'),
        validate(taskValidation.getTasks),
        taskController.getTasks
    )

router
    .route('/:taskId')
    .get(
        auth('getTasks'),
        validate(taskValidation.getTask),
        taskController.getTask
    )
    .patch(
        auth('manageTasks'),
        validate(taskValidation.updateTask),
        taskController.updateTask
    )
    .delete(
        auth('manageTasks'),
        validate(taskValidation.deleteTask),
        taskController.deleteTask
    )

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and retrieval
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: Only authorized users can create new tasks. Tasks must belong to a category.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category the task belongs to
 *             example:
 *               title: "Buy groceries"
 *               description: "Milk, Bread, Eggs"
 *               dueDate: "2024-11-15T10:00:00Z"
 *               categoryId: "648fcfd973c4b7a763e4d123"
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks for the authenticated user, optionally filtered by category.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by task title
 *       - in: query
 *         description: Filter by task status
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter tasks by category ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field in the format field:asc/desc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of tasks
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task
 *     description: Retrieve a task by ID.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a task
 *     description: Only authorized users can update their tasks. Tasks must belong to a category.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category the task belongs to
 *             example:
 *               title: "Buy groceries - updated"
 *               description: "Milk, Bread, Eggs, Butter"
 *               dueDate: "2024-11-16T10:00:00Z"
 *               categoryId: "648fcfd973c4b7a763e4d123"
 *               isCompleted: false
 *               priority: "high"
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a task
 *     description: Only authorized users can delete their tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
