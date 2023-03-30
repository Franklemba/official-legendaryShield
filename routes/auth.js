const express = require('express')

const router = express.Router();


router.get('/', (req, res) =>{

    
    res.render('auth/login');
})  

router.get('/login',(req, res) =>{
   
    res.render('auth/login');
})  

router.get('/signUp', (req, res) =>{
  
    res.render('auth/signUp');
})  




module.exports = router