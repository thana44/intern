const pool = require("../db/db")
const { v4: uuidv4 } = require('uuid')

const createPlaceType = async (req, res) => {
    const { name } = req.body

    try {
        if (!name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อธุรกิจ' })
        }
        const checkPlaceType = `
            SELECT id
            FROM place_type
            WHERE name = ? AND status != 'DELETED'
        `
        const [placeType] = await pool.execute(checkPlaceType, [name])
        if (placeType.length > 0) {
            return res.status(400).json({ message: "ชื่อธุรกิจนี้มีอยู่ในระบบแล้ว" })
        }
        const addPlaceType = `
            INSERT INTO place_type(id, name, status) VALUES (?, ?, ?)
        `
        await pool.execute(addPlaceType, [uuidv4(), name, 'ACTIVE'])

        return res.json({ message: 'เพิ่มประเภทธุรกิจสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const updatePlaceType = async (req, res) => {
    const { name } = req.body
    const { id } = req.params

    try {
        if (!name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อธุรกิจ' })
        }
        const checkPlaceType = `
            SELECT id
            FROM place_type
            WHERE name = ? AND status != 'DELETED'
        `
        const [placeType] = await pool.execute(checkPlaceType, [name])
        if (placeType.length > 0) {
            return res.status(400).json({ message: "ชื่อธุรกิจนี้มีอยู่ในระบบแล้ว" })
        }
        const updatePlaceType = `
            UPDATE place_type
            SET name = ?
            WHERE id = ?
        `
        await pool.execute(updatePlaceType, [name, id])

        return res.json({ message: 'อัพเดทประเภทธุรกิจสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const deletePlaceType = async (req, res) => {
    const { id } = req.params

    try {

        const checkPlace = `
            SELECT id
            FROM place
            WHERE placeTypeId = ? AND status != 'DELETED'
        `
        const [place] = await pool.execute(checkPlace, [id])

        if (place.length > 0) {
            return res.status(400).json({ message: "ไม่สามารถลบได้ เนื่องจากมีสถานที่ใช้งานอยู่" })
        }

        const checkPlaceRequest = `
            SELECT id
            FROM place_request
            WHERE placeTypeId = ? AND status != 'DELETED'
        `
        const [placeRequest] = await pool.execute(checkPlaceRequest, [id])

        if (placeRequest.length > 0) {
            return res.status(400).json({ message: "ไม่สามารถลบได้ เนื่องจากมีคำขอสถานที่ใช้งานอยู่" })
        }
        
        const checkPlaceType = `
            SELECT id
            FROM place_type
            WHERE id = ? AND status != ?
        `
        const [placeType] = await pool.execute(checkPlaceType, [id, 'DELETED'])
        if (placeType.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }
        const updatePlaceType = `
            UPDATE place_type
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updatePlaceType, ['DELETED', id])

        return res.json({ message: 'ลบประเภทธุรกิจสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlaceType = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlaceType = `
            SELECT id, name
            FROM place_type
            WHERE status != 'DELETED'
            AND name LIKE ?
            ORDER BY createAt DESC
            LIMIT ?
            OFFSET ?
        `
        const [result] = await pool.execute(getPlaceType, [`%${search}%`, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM place_type 
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

const getPlaceTypeId = async (req, res) => {
    const { id } = req.params

    try {
        const getPlaceTypeId = `
            SELECT name
            FROM place_type
            WHERE id = ? AND status != ?
        `
        const [placeTypeId] = await pool.execute(getPlaceTypeId, [id, 'DELETED'])
        if (placeTypeId.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ name: placeTypeId[0].name })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlaceTypeSelect = async (req, res) => {
    try {
        const getPlaceType = `
            SELECT id as value, name as label
            FROM place_type
            WHERE status != ?
            ORDER BY createAt DESC
        `
        const [placeType] = await pool.execute(getPlaceType, ['DELETED'])
        if (placeType.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ placeType })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}




module.exports = { createPlaceType, updatePlaceType, deletePlaceType, getPlaceType, getPlaceTypeId, getPlaceTypeSelect }