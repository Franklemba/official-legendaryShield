const mongoose = require('mongoose')
const path = require('path')
const mainImgPath = 'uploads/mainImg';
const imagesPath = 'uploads/images';


const productSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    oldPrice:{
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    type:{
        type: String,
        required: true
    },
    customType:{
        type: String,
        required: false
    },
    mainImg:{
        type: String,
        required: true
    },
    images:[String]
})

productSchema.virtual('ImagesPath').get(function(){
    if(this.mainImg != null){
        return path.join('/', imagesPath )
    }
})

module.exports = mongoose.model('products',productSchema )
module.exports.mainImgPath = mainImgPath
module.exports.imagesPath = imagesPath