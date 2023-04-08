const mongoose = require('mongoose')
const path = require('path')
const customImgPath = 'uploads/customImages'

const customSchema = new mongoose.Schema({
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
    ImgLink:{
        type: String,
        required: true  
    },
    images:[String]
})

customSchema.virtual('customImgPath').get(function(){
    if(this.mainImg != null){
        return path.join('/', customImgPath )
    }
})

module.exports = mongoose.model('customProducts',customSchema)
module.exports.customImgPath = customImgPath