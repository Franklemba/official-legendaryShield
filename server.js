require("dotenv").config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport')
// configure passport
require('./config/passport')(passport);
const { ensureAuthenticated} = require('./config/auth');

const indexRouter = require('./routes/home');
const customRouter = require('./routes/custom');
const woodWorkRouter = require('./routes/woodWork');
const adminRouter = require('./routes/admin');
const storeRouter = require('./routes/store');
const authRouter = require('./routes/auth');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }));

const mongoose = require("mongoose");

//global database connection
   // online connection////
    mongoose.set('strictQuery', true);
    // mongoose.connect(process.env.database_Url,{useNewUrlParser: true})
    // .then(()=>{
    //     console.log('database is connected')
    // }).catch((err) => console.log(err));

// ////local database connection

//mongoose.connect('mongodb://localhost:27017/legendary_shield')
mongoose.connect(process.env.LIVE_DATABASE_URL,{useNewUrlParser: true})
.then(()=>{
    console.log('database is connected')
}).catch((err) => console.log(err));// 


app.use('/',indexRouter );
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false    
  }));
  

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Configure Passport
require('./config/passport')(passport);


app.use('/',indexRouter );

app.use('/custom', customRouter);
app.use('/woodWork', woodWorkRouter);

// app.use('/collections', categoryRouter)

app.use('/store',storeRouter);
app.use('/auth',authRouter);

app.use('/admin',ensureAuthenticated, adminRouter);


app.listen(process.env.PORT || 5300) 