const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    },
    {
        timestamps: true
    }
)

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON)
categorySchema.plugin(paginate)

/**
 * Check if category name is taken
 * @param {string} name - The category name
 * @param {ObjectId} [excludeCategoryId] - The id of the category to exclude
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isNameTaken = async function (name, excludeCategoryId) {
    const category = await this.findOne({
        name,
        _id: { $ne: excludeCategoryId }
    })
    return !!category
}

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema)

module.exports = Category
