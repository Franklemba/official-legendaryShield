const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('auth/login');
})  
router.get('/login',(req, res) =>{
    res.render('auth/login');
})  

router.post('/loginAdmin', (req, res)=>{
    const {
        userName, password
      } = req.body;
      if(userName && password){

      }else{
        return
      }
    console.log(userName + password)

  return;
})
module.exports = router;