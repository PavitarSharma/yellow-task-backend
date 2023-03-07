import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

// Local strategy for username and password login
const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username });
          if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ['profile', 'email'], 
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
          // console.log(profile);
  
          // Create user
          const email = profile.emails[0].value;
          const username = profile.displayName;
          const user = new User({ email, username, googleId: profile.id, password: profile.id });
          await user.save();
          await generateToken(user)
  
          done(null, user);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
  
  // Facebook strategy for login
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
        profileFields: ["id", "emails", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (user) {
            return done(null, user);
          }
          console.log(profile);
          const newUser = new User({
            facebookId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            password: profile.id,
          });
          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

export default passportConfig
