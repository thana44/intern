const express = require('express')
const middleware = require('../middleware/middleware')
const upload = require('../middleware/upload')
const adminMiddleware = require('../middleware/admin')
const { createPlaceRequest, getPlaceRequest, getPlaceRequestId, deletePlaceRequest, createPlaceRequestEdit, getPlaceRequestEdit, getPlaceRequestEditId, updatePlaceNoImage, deletePlaceRequestEdit } = require('../controllers/placeRequest.controller')
const router = express.Router()

router.post('/create', middleware, upload.array("images", 10), createPlaceRequest)
router.post('/create-request-edit', middleware, upload.none(), createPlaceRequestEdit)
router.get('/get-paginate', middleware, adminMiddleware, getPlaceRequest)
router.get('/get-paginate-edit', middleware, adminMiddleware, getPlaceRequestEdit)
router.get('/get-placeRequest/:id', middleware, adminMiddleware, getPlaceRequestId)
router.get('/get-placeRequestEdit/:id', middleware, adminMiddleware, getPlaceRequestEditId)
router.put('/delete/:id', middleware, adminMiddleware, deletePlaceRequest)
router.put('/delete-placeRequestEdit/:id', middleware, adminMiddleware, deletePlaceRequestEdit)
router.put('/update', middleware, adminMiddleware, upload.none(), updatePlaceNoImage)


module.exports = router