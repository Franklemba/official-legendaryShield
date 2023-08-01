const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/adminUserSchema');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'userName' }, (userName, password, done) => {
      // Find user
      console.log(userName)
      User.findOne({ userName: userName })
        .then(user => {
          if (!user) {
           // console.log('That email is not registered' )
            return done(null, false, { message: 'That email is not registered' });
          }
          
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              if(userName == "Legendary Admin"){
                return done(null, user,{userType:'admin'});

              }else{
                return done(null, user,{userType:'designer'});

              }
                console.log('logged in')
            } else {
               // console.log('Password incorrect')
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
