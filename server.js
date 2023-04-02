
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/home');
const customRouter = require('./routes/custom');
const adminRouter = require('./routes/admin');
const storeRouter = require('./routes/store');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))


const mongoose = require("mongoose")


//global database connection

// mongodb://localhost:27017/svint_stores
   ////// online connection////
    // mongoose.set('strictQuery', true);
    // mongoose.connect('mongodb+srv://franklemba:sharon@svintstore.q1axgo7.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true})
    // .then(()=>{
    //     console.log('database is connected')
    // }).catch((err) => console.log(err));





//////////local database connection
mongoose.connect('mongodb://localhost:27017/legendary_shield')
.then(()=>{
    console.log('database is connected')
}).catch((err) => console.log(err));
       


app.use('/',indexRouter );
// app.use('/collections', categoryRouter)
app.use('/store',storeRouter);
app.use('/admin', adminRouter);
app.use('/custom', customRouter);

app.listen(process.env.PORT || 5200) 