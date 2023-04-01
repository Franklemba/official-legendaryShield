
const bcrypt = require("bcrypt");
const adminUser = require('../models/adminUserSchema');
const designerUser = require('../models/designerSchema');


const LocalStrategy = require('passport-local').Strategy;
module.exports = passport => {

    passport.use(new LocalStrategy({
        usernameField: "userName"
    }, (userName, password, done) => {
        
        if (!user) {
            console.log("That phone number is not registered")
            return done(null, false);
        } else {
            console.log('in')
        }
        bcrypt.compare(userPassword, user.userPassword, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                console.log('matched')
                return done(null, user)
            } else {
                console.log('wrong password')
                return done(null, false)
            }
        })

      return done(null, user);
           
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        _user.default.findById(id, function (err, user) {
            done(err, user);
        });
    });
};