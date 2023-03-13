
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');

const indexRouter = require('./routes/home');
const categoryRouter = require('./routes/collection')
const adminRouter = require('./routes/admin');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))


const mongoose = require("mongoose")

//////////local database connection
mongoose.connect('mongodb://localhost:27017/legendary_shield')
.then(()=>{
    console.log('database is connected')
}).catch((err) => console.log(err));
       


app.use('/',indexRouter )
app.use('/collections', categoryRouter)
app.use('/admin', adminRouter);

app.listen(process.env.PORT || 5200) 