const express = require('express')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const { createDistrict, updateDistrict, deleteDistrict, getDistrict, getDistrictSelect } = require('../controllers/district.controller')
const router = express.Router()

router.post('/create', middleware, adminMiddleware, createDistrict)
router.put('/update/:id', middleware, adminMiddleware, updateDistrict)
router.put('/delete/:id', middleware, adminMiddleware, deleteDistrict)
router.get('/get-paginate', middleware, adminMiddleware, getDistrict)
router.get('/get-select/:id', getDistrictSelect)

module.exports = router