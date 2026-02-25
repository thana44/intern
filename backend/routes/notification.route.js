const express = require('express')
const middleware = require('../middleware/middleware')
const { getNotification, delNotification, getSaveCount, getNotiCount, clearAllNotification } = require('../controllers/notification.controller')
const router = express.Router()

router.get('/get-notification', middleware, getNotification)
router.delete('/del-notification/:id', middleware, delNotification)
router.delete('/clear-all-noti', middleware, clearAllNotification)
router.get('/get-save-count', middleware, getSaveCount)
router.get('/get-noti-count', middleware, getNotiCount)


module.exports = router