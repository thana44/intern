const express = require('express')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const { createPlaceType, updatePlaceType, deletePlaceType, getPlaceType, getPlaceTypeId, getPlaceTypeSelect } = require('../controllers/placeType.controller')
const router = express.Router()

router.post('/create-place-type', middleware, adminMiddleware, createPlaceType)
router.put('/update-place-type/:id', middleware, adminMiddleware, updatePlaceType)
router.put('/delete-place-type/:id', middleware, adminMiddleware, deletePlaceType)
router.get('/get-paginate-place-type', middleware, adminMiddleware, getPlaceType)
router.get('/get-place-type/:id', middleware, adminMiddleware, getPlaceTypeId)
router.get('/get-place-type-select', getPlaceTypeSelect)

module.exports = router