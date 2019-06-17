const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
// Load user model
const User = mongoose.model('user');


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(profile);

      const image = profile.photos[0].value;
      // console.log(image);
      // console.log(profile.id);
      // console.log(profile.name.givenName);
      // console.log(profile.name.familyName);
      // console.log(profile.emails[0].value);


      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image
      }

      // console.log(new User(newUser));

      // Check for existing user
      User.findOne({
        googleID: profile.id
      })
        .then(user => {
          if (user) {
            //Return User
            // console.log(user);
            done(null, user);
          }
          else {
            // Create user
            // console.log(new User(newUser));
            new User(newUser).save()
              .then(user => done(null, user));
          }
        })

    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}