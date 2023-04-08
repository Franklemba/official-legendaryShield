const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const User = require('../models/adminUserSchema');

router.get('/', (req, res) =>{
    res.render('auth/login');
});

router.get('/login',(req, res) =>{
    res.render('auth/login');
});

router.get('/registeradmin/:username/:password',(req, res) =>{
  const {username, password} = req.params;
  registerUser(username, password)
  console.log(`Username: ${username}, Password: ${password}`);
  res.send('admin created successfully');
});

router.get('/registerdesigner/:username/:password',(req, res) =>{
  const {username, password} = req.params;
  registerUser(username, password)
  console.log(`Username: ${username}, Password: ${password}`);
  res.send('designer created successfully');
});

router.post('/loginAdmin', (req, res, next)=>{
  console.log(req.body)
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
});

async function registerUser(userName, password) {
  try {
    // Generate a salt to use for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document with the hashed password
    const user = new User({
      userName: userName,
      password: hashedPassword
    });

    // Save the user document to the database
    await user.save();

    console.log(`User ${userName} registered successfully`);
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
  }
}

// user.findOne({
//   userName: userName
// }).then(user => {
//   if (!user) {
//     console.log("That phone number is not registered");
//     res.json({
//       err: "That phone number is not registered"
//     });
//     console.log('wrong password');
//   }
//   // match password
//   bcrypt.compare(password, user.password, (err, isMatch) => {
//     if (err) {
//       throw err;
//     }
//     if (isMatch) {
//       console.log('matched');
//       res.json(user);
//     } else {
//       console.log('Wrong Password');
//       res.json({
//         err: 'Wrong Password'
//       });
//     }
//   });
// }).catch(err => {
//   console.log(err);
// });

module.exports = router
