const pool = require("../db/db")
const cloudinary = require('../cloudinary/cloudinary')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const onSavePlace = async (req, res) => {
    const { id } = req.params
    const curId = req.currentUser.id

    try {

        const checkIsSaved = `
            SELECT id
            FROM save
            WHERE userId = ? AND placeId = ?
        `
        const [save] = await pool.execute(checkIsSaved, [curId, id])

        if (save.length > 0) {
            const unSave = `
                DELETE
                FROM save
                WHERE placeId = ? AND userId = ?
            `
            await pool.execute(unSave, [id, curId])
        } else {
            const save = `
                INSERT INTO save(
                    id, placeId, userId
                )
                VALUES (?, ?, ?)
            `
            await pool.execute(save, [uuidv4(), id, curId])
        }

        return res.json({ message: 'เสร็จสิ้น' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlaceSave = async (req, res) => {
    const curId = req.currentUser.id
    try {

        const getPlace = `
            SELECT
                p.id,
                p.engName,
                pt.name AS placeType,
                d.name AS district,
                ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
                COUNT(DISTINCT r.id) AS review_count,
                GROUP_CONCAT(DISTINCT ip.imgUrl SEPARATOR ' ') AS images,
                GROUP_CONCAT(DISTINCT s.userId SEPARATOR ' ') AS userSave
            FROM place p
            LEFT JOIN place_type pt ON pt.id = p.placeTypeId
            LEFT JOIN district d ON d.id = p.districtId
            LEFT JOIN review r ON r.placeId = p.id AND r.status != 'DELETED'
            LEFT JOIN img_place_request ip ON ip.placeRequestId = p.placeRequestId
            LEFT JOIN save s ON s.placeId = p.id
            WHERE 1=1 AND p.status != 'DELETED' AND s.userId = ?
            GROUP BY p.id
        `
        const [rows] = await pool.execute(getPlace, [curId])

        return res.json({
            success: true,
            data: rows.map((item) => ({
                ...item,
                images: item?.images?.split(' ') || [],
                userSave: item?.userSave?.split(' ') || []
            }))
        });

    } catch (err) {
        console.log(err, 'ERROR')
    }
}


module.exports = { onSavePlace, getPlaceSave }