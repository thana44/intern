const express = require('express')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const { createProvince, updateProvince, deleteProvince, getProvince, getProvinceSelect, getNameProvince } = require('../controllers/province.controller')
const router = express.Router()

router.post('/create', middleware, adminMiddleware, createProvince)
router.put('/update/:id', middleware, adminMiddleware, updateProvince)
router.put('/delete/:id', middleware, adminMiddleware, deleteProvince)
router.get('/get-paginate', middleware, adminMiddleware, getProvince)
router.get('/get-select', getProvinceSelect)
router.get('/get-name/:id', getNameProvince)

module.exports = router