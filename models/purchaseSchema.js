const mongoose = require('mongoose')
var _uuid = require("uuid");

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
    },
    isDeleted:{
        type: Boolean,
        required: false,
        default: false

    },
    _id:{
        type:String,
        default:_uuid.v4()
    }
    
})



module.exports = mongoose.model('purchases',purchaseSchema)
