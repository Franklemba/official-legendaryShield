const mongoose = require('mongoose')
const path = require('path')
const mainImgPath = 'uploads/mainImg';
const imagesPath = 'uploads/startContentImages';


const startContentSchema = new mongoose.Schema({
    startContent: {
        type: String,
        required: false
    },
    mainImg:{
        type: String,
        required: false
    },
    smallVersionImage:{
        type: String,
        required: false 
    }
})


startContentSchema.virtual('ImagesPath').get(function(){
    if(this.mainImg != null){
        return path.join('/', imagesPath )
    }
})

module.exports = mongoose.model('StartContent',startContentSchema )
module.exports.mainImgPath = mainImgPath;
module.exports.imagesPath = imagesPath
