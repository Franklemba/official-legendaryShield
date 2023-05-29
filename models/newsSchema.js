const mongoose = require('mongoose')
const path = require('path')
const mainImgPath = 'uploads/mainImg';
const imagesPath = 'uploads/newsImages';


const newsSchema = new mongoose.Schema({
    newsContent: {
        type: String,
        required: false
    },
    newsTitle: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    mainImg:{
        type: String,
        required: false
    },
    images:[String]
})

newsSchema.virtual('ImagesPath').get(function(){
    if(this.mainImg != null){
        return path.join('/', imagesPath )
    }
})

module.exports = mongoose.model('news',newsSchema )
module.exports.mainImgPath = mainImgPath
module.exports.imagesPath = imagesPath