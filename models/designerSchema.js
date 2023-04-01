const mongoose = require('mongoose')


const designerSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false,
      },
      password: {
        type: String,
        required: false,
      },  
})


module.exports = mongoose.model('designer',designerSchema )
