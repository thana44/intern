const express = require('express')
const middleware = require('../middleware/middleware')
const adminMiddleware = require('../middleware/admin')
const { createQuestion, getQuestion, updateQuestion, deleteQuestion, getShowQuestion } = require('../controllers/question.controller')
const router = express.Router()

router.post('/create', middleware, adminMiddleware, createQuestion)
router.put('/update/:id', middleware, adminMiddleware, updateQuestion)
router.get('/get-paginate', middleware, adminMiddleware, getQuestion)
router.delete('/delete/:id', middleware, adminMiddleware, deleteQuestion)
router.get('/getshow-question', getShowQuestion)

module.exports = router