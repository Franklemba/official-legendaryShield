const mongoose = require('mongoose')


const purchaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    Pnumber: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    cart:{
        type: array,
        required: true
    },
    purchasedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



module.exports = mongoose.model('purchases',purchaseSchema)
