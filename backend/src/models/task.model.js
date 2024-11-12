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
            type: Number,
            enum: [1, 2, 3], // 1: low, 2: medium, 3: high
            default: 1
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
