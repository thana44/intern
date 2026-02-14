const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const pool = require('./db/db');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth-api/auth/google/callback`
},
    async (accessToken, refreshToken, profile, cb) => {
        console.log(profile, 'this is profile')
        const checkUser = "SELECT id, username, profileImg, role, status FROM user WHERE googleId = ?";
        const [result] = await pool.execute(checkUser, [profile.id])
        console.log(result, 'this is result')
        if (result.length === 0) {
            const newUser = {
                id: uuidv4(),
                googleId: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
                profileImg: profile.photos[0].value
            }

            const checkUsername = "SELECT id FROM user WHERE username = ?"
            const [user] = await pool.execute(checkUsername, [newUser.username])
            if (user.length > 0 || newUser.username.length > 10) {
                newUser.username = newUser.id.slice(0, 10)
            }

            const addUser = "INSERT INTO user(id, googleId, email, username, profileImg, role, status, verifyAccount) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
            await pool.execute(addUser, [newUser.id, newUser.googleId, newUser.email, newUser.username, newUser.profileImg, 'USER', 'ACTIVE', 0])
            const token = jwt.sign({ id: newUser.id, username: newUser.username, profileImg: newUser.profileImg, role: 'USER', status: 'ACTIVE' }, process.env.JWT_SECRET, { expiresIn: '1h' })

            return cb(null, { token })
        }

        if (result[0].status === "DELETED") {
            return cb(null, false, {
                message: "บัญชีนี้ถูกปิดการใช้งานแล้ว",
            });
        }
        const token = jwt.sign({ id: result[0].id, username: result[0].username, profileImg: result[0].profileImg, role: result[0].role, status: result[0].status }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return cb(null, { token })
    }
))