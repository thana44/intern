const express = require('express')
const middleware = require('../middleware/middleware')
const { getPlaceSave, onSavePlace } = require('../controllers/save.controller')
const router = express.Router()

router.get('/get-place-save', middleware, getPlaceSave)
router.post('/save-unsave/:id', middleware, onSavePlace)


module.exports = router