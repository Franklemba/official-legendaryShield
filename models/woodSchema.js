const mongoose = require('mongoose')
const path = require('path')
const woodImgPath = 'uploads/woodImages'
var _uuid = require("uuid");

const woodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    Pnumber: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requestedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isRead:{
        type: Boolean,
        required: false,
        default: false
    },
    ImgLink:{
        type: String,
        required: true  
    },
    images:[String],
    isDeleted:{
        type: Boolean,
        required: false,
        default: false
    },
    _id:{
        type:String,
        default:mongoose.Types.ObjectId()
    }
    
})

woodSchema.virtual('woodImgPath').get(function(){
    if(this.mainImg != null){
        return path.join('/', woodImgPath )
    }
})

module.exports = mongoose.model('woodProducts',woodSchema)
module.exports.woodImgPath = woodImgPath