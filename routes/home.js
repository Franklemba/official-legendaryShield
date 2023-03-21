const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.render('home/index')
})

router.get('/about', (req, res) => {
    res.render('home/about')
    // res.send('we run this shit')
})



module.exports = router;



