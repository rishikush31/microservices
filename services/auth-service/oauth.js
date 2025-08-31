const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let result = await pool.query('SELECT * FROM users WHERE email=$1', [profile.emails[0].value]);
        let user;
        if (result.rows.length === 0) {
          // Create new user
          result = await pool.query(
            'INSERT INTO users(name, email) VALUES($1, $2) RETURNING id, name, email',
            [profile.displayName, profile.emails[0].value]
          );
          user = result.rows[0];
        } else {
          user = result.rows[0];
        }

        done(null, user); // only pass user object
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
