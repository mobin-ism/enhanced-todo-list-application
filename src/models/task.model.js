const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        dueDate: {
            type: Date
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'low'
        }
    },
    {
        timestamps: true
    }
)

// Add plugin that converts mongoose to JSON
taskSchema.plugin(toJSON)
taskSchema.plugin(paginate)

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema)

module.exports = Task
