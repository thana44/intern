const pool = require("../db/db")
const cloudinary = require('../cloudinary/cloudinary')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const getImagePlaceRequest = async (req, res) => {
    const { id } = req.params
    try {

        const getImage = `
            SELECT id, publicId, imgUrl
            FROM img_place_request
            WHERE placeRequestId = ?
        `
        const [result] = await pool.execute(getImage, [id])

        return res.json({ result })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getMyReviewImage = async (req, res) => {
    const { id } = req.params
    try {

        const getImage = `
            SELECT id, publicId, imgUrl
            FROM img_review
            WHERE reviewId = ?
        `
        const [result] = await pool.execute(getImage, [id])

        return res.json({ result })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlaceAllPhoto = async (req, res) => {
    const { id } = req.params
    try {

        const getImage = `
            SELECT
                p.id,
                p.engName,
                pt.name AS placeType,
                d.name AS district,
                ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
                GROUP_CONCAT(DISTINCT ip.imgUrl SEPARATOR ' ') AS images,
                GROUP_CONCAT(DISTINCT r.id SEPARATOR ' ') AS reviewIds
            FROM place p
            LEFT JOIN place_type pt ON pt.id = p.placeTypeId
            LEFT JOIN district d ON d.id = p.districtId
            LEFT JOIN review r ON r.placeId = p.id AND r.status != 'DELETED'
            LEFT JOIN img_place_request ip ON ip.placeRequestId = p.placeRequestId
            WHERE 1=1 AND p.status != 'DELETED' AND p.id = ?
            GROUP BY p.id
        `
        const [result] = await pool.execute(getImage, [id])

        const newResult = result.map(item => ({
            ...item,
            images: item.images ? item.images.split(' ') : [],
            reviewIds: item.reviewIds ? item.reviewIds.split(' ') : [],
        }))

        const reviewId = newResult[0]?.reviewIds
        let reviewImages = []
        if (reviewId.length > 0) {
            const getImage = `
                SELECT imgUrl
                FROM img_review
                WHERE reviewId IN (${reviewId.map(() => '?').join(',')})
            `
            const [imgReview] = await pool.execute(getImage, [...reviewId])
            reviewImages = imgReview.map(i => i.imgUrl)
        }

        return res.json({ newResult, reviewImages })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}


module.exports = { getImagePlaceRequest, getMyReviewImage, getPlaceAllPhoto }