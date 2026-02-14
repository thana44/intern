const express = require('express')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const { getDashboardStats, getCountDash } = require('../controllers/dashboard.controller')
const router = express.Router()

router.get('/get-dashboard', middleware, adminMiddleware, getDashboardStats)
router.get('/get-count-dash', middleware, adminMiddleware, getCountDash)

module.exports = router