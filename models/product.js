
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'please enter a product name'],
    },
    seller: {
        type: mongoose.Types.ObjectId,
    },
    price: {
        type: Number,
        required: [true, 'please enter the price']
    },
    prePrice: {
        type: Number,
        default: 0
    },
    delivery: {
        type: Number,
        required: [true, 'delivery required']
    },
    isWarrantyAvalable: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        max: 5,
        default: 4
    },
    reviews: {
        type: [{
            name: {
                type: String,
                required: [true, 'review name required']
            },
            message: {
                type: String,
                required: [true, 'review message required']
            },
            date: Date
        }],
        default: []
    },
    image: {
        type: String,
        required: [true, 'no product image found']
    },
    likes: {
        type: [Object],
        default: []
    },
    category: {
        type: String,
        enum: ['fashion', 'Spoarts', 'Device', 'Toys']
    },
    tag: {
        type: String
    }
})

module.exports = mongoose.model('products', schema)
