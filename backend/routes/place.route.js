const express = require('express')
const middleware = require('../middleware/middleware')
const upload = require('../middleware/upload')
const adminMiddleware = require('../middleware/admin')
const { createPlace, getPlace, getPlaceId, updatePlace, deletePlace, getPlaceIdReview, createPlaceNoRequest, getPlaceFilter, getPlaceSelect } = require('../controllers/place.controller')
const router = express.Router()

router.post('/create', middleware, adminMiddleware, upload.array("newImages", 10), createPlace)
router.post('/create-no-request', middleware, adminMiddleware, upload.array("images", 10), createPlaceNoRequest)
router.put('/update', middleware, adminMiddleware, upload.array("newImages", 10), updatePlace)
router.get('/get-paginate', middleware, adminMiddleware, getPlace)
router.get('/get-place/:id', middleware, adminMiddleware, getPlaceId)
router.put('/delete/:id', middleware, adminMiddleware, deletePlace)
router.get('/get-place-review/:id', getPlaceIdReview)
router.post('/get-filter', getPlaceFilter)
router.get('/get-select', middleware, getPlaceSelect)


module.exports = router