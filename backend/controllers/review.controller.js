const pool = require("../db/db")
const cloudinary = require('../cloudinary/cloudinary')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const createReview = async (req, res) => {
    const { rating, position, period, detail, placeId } = req.body
    const curId = req.currentUser.id

    try {
        const rate = parseInt(rating)
        if (!rate || rate <= 0) {
            return res.status(400).json({ message: 'กรุณาระบุคะแนนรีวิว' })
        }
        if (!position) {
            return res.status(400).json({ message: 'กรุณาระบุตำแหน่งที่ฝึก' })
        }
        if (!period) {
            return res.status(400).json({ message: 'กรุณาระบุระยะเวลาที่ฝึก' })
        }
        if (!detail) {
            return res.status(400).json({ message: 'กรุณาแสดงความคิดเห็น' })
        }

        const checkReview = `
            SELECT id
            FROM review
            WHERE userId = ? AND placeId = ? AND status != 'DELETED'
        `
        const [review] = await pool.execute(checkReview, [curId, placeId])
        if (review.length > 0) {
            return res.status(400).json({ message: 'คุณได้รีวิวสถานที่นี้ไปแล้ว' })
        }

        const id = uuidv4()
        const createReview = `
            INSERT INTO review(
                id, rating, position, period, detail, placeId, userId, status
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        `
        await pool.execute(createReview, [id, rate, position, period, detail, placeId, curId, 'ACTIVE'])

        if (req.files || req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "imgReview",
                })

                const publicId = result.public_id
                const imgUrl = result.secure_url

                const addImgReview = `
                INSERT INTO img_review (
                    id, publicId, imgUrl, reviewId
                )
                VALUES (?, ?, ?, ?)
            `
                await pool.execute(addImgReview, [uuidv4(), publicId, imgUrl, id])

                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        // return res.json({ message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, rate, position, period, detail, curId, placeId })
        return res.json({ message: 'บันทึกรีวิวสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            message: 'Upload failed',
            error: err.message,
        })
    } finally {
        if (req.files) {
            req.files.forEach((file) => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
    }
}

const getMyReview = async (req, res) => {
    const { placeId } = req.params
    const curId = req.currentUser.id

    try {

        const getMyReview = `
            SELECT 
                r.*, 
                u.username, 
                u.profileImg,
                GROUP_CONCAT(DISTINCT ir.imgUrl SEPARATOR ' ') AS images,
                GROUP_CONCAT(DISTINCT lr.userId SEPARATOR ' ') AS likes
            FROM review r
            LEFT JOIN user u ON u.id = r.userId
            LEFT JOIN img_review ir ON ir.reviewId = r.id
            LEFT JOIN like_review lr ON lr.reviewId = r.id
            WHERE r.placeId = ?
            AND r.userId = ?
            AND r.status != 'DELETED'
            GROUP BY r.id
        `
        const [result] = await pool.execute(getMyReview, [placeId, curId])

        const newResult = result.map((item) => ({
            ...item,
            images: item.images?.split(' ') || [],
            likes: item.likes?.split(' ') || []
        }))

        // const [test] = await pool.execute('SHOW VARIABLES LIKE "group_concat_max_len"')
        // console.log(test)

        return res.json({ result: newResult })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const updateReview = async (req, res) => {
    const { rating, position, period, detail, placeId, reviewId } = req.body
    const deletedImages = JSON.parse(req.body.deletedImages || "[]")
    const keepOldImages = JSON.parse(req.body.keepOldImages || "[]")
    const curId = req.currentUser.id

    try {
        const rate = parseInt(rating)
        if (!rate || rate <= 0) {
            return res.status(400).json({ message: 'กรุณาระบุคะแนนรีวิว' })
        }
        if (!position) {
            return res.status(400).json({ message: 'กรุณาระบุตำแหน่งที่ฝึก' })
        }
        if (!period) {
            return res.status(400).json({ message: 'กรุณาระบุระยะเวลาที่ฝึก' })
        }
        if (!detail) {
            return res.status(400).json({ message: 'กรุณาแสดงความคิดเห็น' })
        }

        if (deletedImages.length > 0) {
            for (const img of deletedImages) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_review WHERE id = ?", [img.id])
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "imgReview",
                })

                const publicId = result.public_id
                const imgUrl = result.secure_url

                const addImgReview = `
                INSERT INTO img_review (
                    id, publicId, imgUrl, reviewId
                )
                VALUES (?, ?, ?, ?)
            `
                await pool.execute(addImgReview, [uuidv4(), publicId, imgUrl, reviewId])

                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        const updateReview = `
            UPDATE review
            SET rating = ?, position = ?, period = ?, detail = ?
            WHERE placeId = ? AND userId = ? AND status != 'DELETED'
        `
        await pool.execute(updateReview, [rate, position, period, detail, placeId, curId])

        // return res.json({ message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, rate, position, period, detail, curId, placeId, deletedImages, keepOldImages, reviewId })
        return res.json({ message: 'อัพเดทรีวิวสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            message: 'Upload failed',
            error: err.message,
        })
    } finally {
        if (req.files) {
            req.files.forEach((file) => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
    }
}

const deleteReview = async (req, res) => {
    const { id } = req.params

    try {
        const checkReview = `
            SELECT id
            FROM review
            WHERE id = ? AND status != ?
        `
        const [result] = await pool.execute(checkReview, [id, 'DELETED'])
        if (result.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }

        const getImg = `
            SELECT id, publicId
            FROM img_review
            WHERE reviewId = ?
        `
        const [image] = await pool.execute(getImg, [id])

        if (image.length > 0) {
            for (const img of image) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_review WHERE id = ?", [img.id])
            }
        }

        const updateReview = `
            UPDATE review
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updateReview, ['DELETED', id])

        return res.json({ message: 'รีวิวถูกลบแล้ว' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getReviewSummary = async (req, res) => {
    const { placeId } = req.params

    try {
        const sql = `
            SELECT
                COUNT(*) AS totalReviews,
                ROUND(AVG(rating), 1) AS avgRating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS star5,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS star4,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS star3,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS star2,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS star1
            FROM review
            WHERE placeId = ?
            AND status != 'DELETED'
        `

        const [[result]] = await pool.execute(sql, [placeId])

        const total = result.totalReviews || 1

        return res.json({
            avgRating: Number(result.avgRating || 0),
            totalReviews: result.totalReviews || 0,
            breakdown: {
                5: Math.round((result.star5 / total) * 100),
                4: Math.round((result.star4 / total) * 100),
                3: Math.round((result.star3 / total) * 100),
                2: Math.round((result.star2 / total) * 100),
                1: Math.round((result.star1 / total) * 100),
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}


const getReviewInPlace = async (req, res) => {
    const { placeId } = req.params
    const { selectedStar, sortBy } = req.body

    try {
        let where = `WHERE r.placeId = ? AND r.status != 'DELETED'`
        const params = [placeId]

        // ⭐ filter ดาว
        if (selectedStar) {
            where += ` AND r.rating = ?`
            params.push(selectedStar)
        }

        // 🔃 sort
        let orderBy = `ORDER BY r.createAt DESC` // default ล่าสุด

        if (sortBy === 'maxLike') {
            orderBy = `ORDER BY likeCount DESC`
        }

        const sql = `
            SELECT 
                r.*,
                u.username,
                u.profileImg,
                GROUP_CONCAT(DISTINCT ir.imgUrl SEPARATOR ' ') AS images,
                GROUP_CONCAT(DISTINCT lr.userId SEPARATOR ' ') AS likes,
                COUNT(DISTINCT lr.userId) AS likeCount
            FROM review r
            LEFT JOIN user u ON u.id = r.userId
            LEFT JOIN img_review ir ON ir.reviewId = r.id
            LEFT JOIN like_review lr ON lr.reviewId = r.id
            ${where}
            GROUP BY r.id
            ${orderBy}
        `

        const [result] = await pool.execute(sql, params)

        const newResult = result.map(item => ({
            ...item,
            images: item.images ? item.images.split(' ') : [],
            likes: item.likes ? item.likes.split(' ') : [],
            likeCount: Number(item.likeCount)
        }))

        res.json({ newResult })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

const likeAndUnLike = async (req, res) => {
    const { reviewId } = req.params
    const curId = req.currentUser.id

    try {
        const checkLike = `
            SELECT id
            FROM like_review
            WHERE reviewId = ? AND userId = ?
        `
        const [result] = await pool.execute(checkLike, [reviewId, curId])
        if (result.length >= 1) {
            const delLike = `
                DELETE
                FROM like_review
                WHERE reviewId = ? AND userId = ?
            `
            await pool.execute(delLike, [reviewId, curId])
        } else {
            const addLike = `
                INSERT INTO like_review(
                    id, reviewId, userId
                )
                VALUES (?, ?, ?)
            `
            await pool.execute(addLike, [uuidv4(), reviewId, curId])
        }

        return res.json({ message: 'เสร็จสิ้น' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

const reportReview = async (req, res) => {
    const { reviewId } = req.params
    const { detail } = req.body
    const curId = req.currentUser.id

    try {

        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุสาเหตุ' })
        }

        const checkReport = `
            SELECT id
            FROM report_review
            WHERE reviewId = ? AND reportById = ? AND status != 'DELETED'
        `
        const [result] = await pool.execute(checkReport, [reviewId, curId])

        if (result.length > 0) {
            return res.status(400).json({ message: 'คุณได้รายงานรีวิวนี้แล้ว' })
        }

        const addReportReview = `
            INSERT INTO report_review (id, reviewId, detail, reportById, status)
            VALUES (?, ?, ?, ?, ?)
        `
        await pool.execute(addReportReview, [uuidv4(), reviewId, detail, curId, 'ACTIVE'])

        return res.json({ message: 'เสร็จสิ้น' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

const getReportReview = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getReport = `
            SELECT 
                rr.id,
                rr.reviewId,
                rr.detail,

                reporter.username AS reporterName,
                reviewer.username AS reviewerName,
                reviewer.id AS reviewerId,
                r.placeId AS placeId

            FROM report_review rr

            LEFT JOIN review r 
                ON r.id = rr.reviewId

            LEFT JOIN user reporter 
                ON reporter.id = rr.reportById

            LEFT JOIN user reviewer 
                ON reviewer.id = r.userId

            WHERE rr.status != 'DELETED'
            AND (
                reporter.username LIKE ?
                OR reviewer.username LIKE ?
            )

            ORDER BY rr.createAt DESC
            LIMIT ?
            OFFSET ?
        `

        const [result] = await pool.execute(getReport, [`%${search}%`, `%${search}%`, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM report_review 
            WHERE status != 'DELETED'
        `;
        const [countResult] = await pool.execute(getCount, []);
        const total = countResult[0].total;

        // return res.json({ page, pageSize, offset, limit, result, total })
        return res.json({
            data: result,
            pagination: {
                page: +page,
                limit: limit,
                total,
            }
        })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getReviewId = async (req, res) => {
    const { reviewId } = req.params

    try {

        const getMyReview = `
            SELECT 
                r.*, 
                u.username, 
                u.profileImg,
                GROUP_CONCAT(DISTINCT ir.imgUrl SEPARATOR ' ') AS images,
                GROUP_CONCAT(DISTINCT lr.userId SEPARATOR ' ') AS likes
            FROM review r
            LEFT JOIN user u ON u.id = r.userId
            LEFT JOIN img_review ir ON ir.reviewId = r.id
            LEFT JOIN like_review lr ON lr.reviewId = r.id
            WHERE r.id = ?
            AND r.status != 'DELETED'
            GROUP BY r.id
        `
        const [result] = await pool.execute(getMyReview, [reviewId])

        const newResult = result.map((item) => ({
            ...item,
            images: item.images?.split(' ') || [],
            likes: item.likes?.split(' ') || []
        }))

        return res.json({ result: newResult })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const delReportReview = async (req, res) => {
    const { reportId } = req.params

    try {

        const checkReport = `
            SELECT id
            FROM report_review
            WHERE id = ?
        `
        const [result] = await pool.execute(checkReport, [reportId])

        if (result.length === 0) {
            return res.status(400).json({ message: 'ไม่พบรายงาน' })
        }

        const delReport = `
            DELETE
            FROM report_review
            WHERE id = ?
        `
        await pool.execute(delReport, [reportId])

        return res.json({ message: 'ลบสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const delReviewFromReport = async (req, res) => {
    const { placeId, reviewId, reviewerId, detail } = req.body

    try {

        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุเหตุผล' })
        }

        const checkReview = `
            SELECT id
            FROM review
            WHERE id = ?
        `
        const [review] = await pool.execute(checkReview, [reviewId])

        if (review.length === 0) {
            return res.status(404).json({ message: 'ไม่พบรีวิว' })
        }

        const getImg = `
            SELECT id, publicId
            FROM img_review
            WHERE reviewId = ?
        `
        const [image] = await pool.execute(getImg, [reviewId])

        if (image.length > 0) {
            for (const img of image) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_review WHERE id = ?", [img.id])
            }
        }

        const delReview = `
            DELETE
            FROM review
            WHERE id = ?
        `
        await pool.execute(delReview, [reviewId])

        const delReport = `
            DELETE
            FROM report_review
            WHERE reviewId = ?
        `
        await pool.execute(delReport, [reviewId])

        const addNotification = `
            INSERT INTO notification (id, notificationType, detail, userId, status, placeId)
            VALUES (?, ?, ?, ?, ?, ?)
        `
        await pool.execute(addNotification, [uuidv4(), 'DELREVIEW', detail, reviewerId, 'ACTIVE', placeId])

        return res.json({ message: 'ลบสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const getAllReview = async (req, res) => {
    const { page, pageSize, search } = req.query
    const curId = req.currentUser.id

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlace = `
            SELECT r.*,
                p.thaiName AS thaiName,
                p.engName AS engName,
                u.username AS username
            FROM review r
            LEFT JOIN place p ON p.id = r.placeId
            LEFT JOIN user u ON u.id = r.userId
            WHERE r.status != 'DELETED' AND u.id != ?
            AND (
                p.thaiName LIKE ?
                OR p.engName LIKE ?
                OR u.username LIKE ?
            )
            ORDER BY r.createAt DESC
            LIMIT ?
            OFFSET ?
        `;

        const keyword = `%${search}%`;

        const [result] = await pool.execute(getPlace, [curId, keyword, keyword, keyword, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(r.id) AS total 
            FROM review r
            LEFT JOIN user u ON u.id = r.userId
            WHERE r.status != 'DELETED' AND u.id != ?
        `;
        const [countResult] = await pool.execute(getCount, [curId]);
        const total = countResult[0].total;

        return res.json({
            data: result,
            pagination: {
                page: +page,
                limit: limit,
                total,
            }
        })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const delReviewFromAll = async (req, res) => {
    const { placeId, reviewId, userId, detail } = req.body

    try {

        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุเหตุผล' })
        }

        const checkReview = `
            SELECT id
            FROM review
            WHERE id = ?
        `
        const [review] = await pool.execute(checkReview, [reviewId])

        if (review.length === 0) {
            return res.status(404).json({ message: 'ไม่พบรีวิว' })
        }

        const getImg = `
            SELECT id, publicId
            FROM img_review
            WHERE reviewId = ?
        `
        const [image] = await pool.execute(getImg, [reviewId])

        if (image.length > 0) {
            for (const img of image) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_review WHERE id = ?", [img.id])
            }
        }

        const delReview = `
            DELETE
            FROM review
            WHERE id = ?
        `
        await pool.execute(delReview, [reviewId])

        const addNotification = `
            INSERT INTO notification (id, notificationType, detail, userId, status, placeId)
            VALUES (?, ?, ?, ?, ?, ?)
        `
        await pool.execute(addNotification, [uuidv4(), 'DELREVIEW', detail, userId, 'ACTIVE', placeId])

        const checkReport = `
            SELECT id
            FROM report_review
            WHERE reviewId = ?
        `
        const [report] = await pool.execute(checkReport, [reviewId])

        if (report.length > 0) {
            const delReport = `
            DELETE
            FROM report_review
            WHERE reviewId = ?
            `
            await pool.execute(delReport, [reviewId])
        }

        return res.json({ message: 'ลบสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}


module.exports = { createReview, getMyReview, updateReview, deleteReview, getReviewSummary, getReviewInPlace, likeAndUnLike, reportReview, getReportReview, getReviewId, delReportReview, delReviewFromReport, getAllReview, delReviewFromAll }