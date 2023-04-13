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
    cart:{
        type: Array,
        required: true
    },
    isRead:{
        type: Boolean,
        required: false,
        default: false
    }
    ,
    purchasedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



module.exports = mongoose.model('purchases',purchaseSchema)
