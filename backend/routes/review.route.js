const express = require('express')
const middleware = require('../middleware/middleware')
const upload = require('../middleware/upload')
const adminMiddleware = require('../middleware/admin')
const { createReview, getMyReview, updateReview, deleteReview, getReviewSummary, getReviewInPlace, likeAndUnLike, reportReview, getReportReview, getReviewId, delReportReview, delReviewFromReport, getAllReview, delReviewFromAll } = require('../controllers/review.controller')
const router = express.Router()

router.post('/create-review', middleware, upload.array("images", 10), createReview)
router.put('/update', middleware, upload.array("newImages", 10), updateReview)
router.get('/getMyReview/:placeId', middleware, getMyReview)
router.put('/delete/:id', middleware, deleteReview)
router.get('/review-summary/:placeId', getReviewSummary)
router.post('/get-all-review/:placeId', getReviewInPlace)
router.put('/like-unlike/:reviewId', middleware, likeAndUnLike)
router.post('/report-review/:reviewId', middleware, reportReview)
router.get('/get-paginate', middleware, adminMiddleware, getReportReview)
router.get('/get-review/:reviewId', middleware, adminMiddleware, getReviewId)
router.delete('/delete-report/:reportId', middleware, adminMiddleware, delReportReview)
router.post('/delete-review-from-report', middleware, adminMiddleware, delReviewFromReport)
router.post('/delete-review-from-all', middleware, adminMiddleware, delReviewFromAll)
router.get('/get-paginate-all-review', middleware, adminMiddleware, getAllReview)



module.exports = router