const express = require('express')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const { getImagePlaceRequest, getMyReviewImage, getPlaceAllPhoto } = require('../controllers/image.controller')
const router = express.Router()

router.get('/get-image-place-request/:id', middleware, adminMiddleware, getImagePlaceRequest)
router.get('/get-image/:id', getImagePlaceRequest)
router.get('/get-my-review-image/:id', middleware, getMyReviewImage)
router.get('/get-all-place/:id', getPlaceAllPhoto)

module.exports = router