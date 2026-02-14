const express = require('express')
const { registerController, loginController, getCurrentUserController, logOutController, resetPassword, checkToken, IsAdmin } = require('../controllers/auth.controller')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const passport = require('passport')
const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.put('/reset-password', middleware, resetPassword)
router.get('/check-token', middleware, checkToken)
router.get('/check-admin', middleware, adminMiddleware, IsAdmin)
router.get('/get-current-user', middleware, getCurrentUserController)
router.get('/log-out', logOutController)

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), function (req, res) {
    const { token, profile } = req.user
    res.cookie('token', token, { httpOnly: true })
    res.redirect(`${process.env.FRONTEND_URL}/`);
})

module.exports = router