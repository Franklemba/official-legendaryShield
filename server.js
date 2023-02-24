
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index')
const aboutRouter = require('./routes/about')
const shopRouter = require('./routes/shop')
const contactRouter = require('./routes/contacts')
const productRouter = require('./routes/product')
const appleRouter = require('./routes/apple')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))




//////////local database connection
mongoose.connect('mongodb://localhost:27017/legendaryshield')
.then(()=>{
    console.log('database is connected')
}).catch((err) => console.log(err));
    
    
// //////////////////////////database connection//////////////

app.use('/', indexRouter)
app.use('/about', aboutRouter)
app.use('/shop', shopRouter)
app.use('/contacts', contactRouter)
app.use('/admin_product', productRouter)
app.use('/item',appleRouter)

app.listen(process.env.PORT || 5900) 