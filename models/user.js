
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userModel = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'please enter your username']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'please enter a email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, , 'please enter a valid']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
    },
    profilePic: {
        type: String,
        required: [true, 'please enter a profile pic']
    },
    role: {
        type: String,
        enum: [
            'admin',
            'seller',
            'buyer'
        ]
    },
    cart: {
        type: [{
            proId: {
                type: mongoose.Types.ObjectId,
                required: true,
            },
            itemCount: {
                type: Number,
                default: 1
            }
        }]
    }
})

userModel.pre('save', async function () {
    const solt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, solt)
})

userModel.methods.comparePassword = async function (currentPassword) {
    return await bcrypt.compare(currentPassword, this.password)
}

module.exports = mongoose.model('accounts', userModel)