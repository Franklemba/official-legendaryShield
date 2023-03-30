const mongoose = require('mongoose')


const adminSchema = new mongoose.Schema({
    userName:{
        type:'',

    },
    password:{
        type:'',
        
         }
})


module.exports = mongoose.model('adminUser',adminSchema )
