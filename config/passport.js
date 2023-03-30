"use strict";


var _bcrypt = _interopRequireDefault(require("bcrypt"));


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LocalStrategy = require('passport-local').Strategy;

module.exports = passport => {
    passport.use(new LocalStrategy({
        usernameField: "phoneNumber"
    }, (phoneNumber, password, done) => {
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