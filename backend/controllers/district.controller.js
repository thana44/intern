const pool = require("../db/db")
const { v4: uuidv4 } = require('uuid')

const createDistrict = async (req, res) => {
    const { name, provinceId } = req.body

    try {
        if (!name || !provinceId) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const checkDistrict = `
            SELECT id
            FROM district
            WHERE name = ? AND provinceId = ? AND status != 'DELETED'
        `
        const [district] = await pool.execute(checkDistrict, [name, provinceId])
        if (district.length > 0) {
            return res.status(400).json({ message: "เขต/อำเภอนี้มีอยู่ในระบบแล้ว" })
        }

        const checkProvince = `
            SELECT id
            FROM province
            WHERE id = ? AND status != 'DELETED'
        `
        const [province] = await pool.execute(checkProvince, [provinceId])
        if (province.length === 0) {
            return res.status(400).json({ message: "ไม่พบจังหวัดในระบบ" })
        }

        const addDistrict = `
            INSERT INTO district(id, name, status, provinceId) 
            VALUES (?, ?, ?, ?)
        `
        await pool.execute(addDistrict, [uuidv4(), name, 'ACTIVE', provinceId])

        return res.json({ message: 'เพิ่มเขต/อำเภอสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const updateDistrict = async (req, res) => {
    const { name, provinceId } = req.body
    const { id } = req.params

    try {
        if (!name || !provinceId) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const checkDistrict = `
            SELECT id
            FROM district
            WHERE name = ? AND provinceId = ? AND status != 'DELETED'
        `
        const [district] = await pool.execute(checkDistrict, [name, provinceId])
        if (district.length > 0) {
            return res.status(400).json({ message: "เขต/อำเภอนี้มีอยู่ในระบบแล้ว" })
        }

        const checkProvince = `
            SELECT id
            FROM province
            WHERE id = ? AND status != 'DELETED'
        `
        const [province] = await pool.execute(checkProvince, [provinceId])
        if (province.length === 0) {
            return res.status(400).json({ message: "ไม่พบจังหวัดในระบบ" })
        }

        const updateDistrict = `
            UPDATE district
            SET name = ?, provinceId = ?
            WHERE id = ?
        `
        await pool.execute(updateDistrict, [name, provinceId, id])

        return res.json({ message: 'อัพเดทเขต/อำเภอสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const deleteDistrict = async (req, res) => {
    const { id } = req.params

    try {

        const checkPlace = `
            SELECT id
            FROM place
            WHERE districtId = ? AND status != 'DELETED'
        `
        const [place] = await pool.execute(checkPlace, [id])

        if (place.length > 0) {
            return res.status(400).json({ message: "ไม่สามารถลบได้ เนื่องจากมีสถานที่ใช้งานเขต/อำเภอนี้อยู่" })
        }

        const checkDistrict = `
            SELECT id
            FROM district
            WHERE id = ? AND status != ?
        `
        const [district] = await pool.execute(checkDistrict, [id, 'DELETED'])
        if (district.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }
        const updateDistrict = `
            UPDATE district
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updateDistrict, ['DELETED', id])

        return res.json({ message: 'ลบเขต/อำเภอสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getDistrict = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getDistrict = `
            SELECT d.id,
                d.name AS districtName,
                p.id AS provinceId,
                p.name AS provinceName
            FROM district d
            LEFT JOIN province p ON d.provinceId = p.id
            WHERE d.status != 'DELETED'
            AND (
                d.name LIKE ?
                OR p.name LIKE ?
            )
            ORDER BY d.createAt DESC
            LIMIT ?
            OFFSET ?
        `;

        const keyword = `%${search}%`;

        const [result] = await pool.execute(getDistrict, [keyword, keyword, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM district 
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


const getDistrictSelect = async (req, res) => {
    const { id } = req.params
    try {
        if (!id) {
            return res.json({ message: 'กรุณาเลือกจังหวัด' })
        }
        const getDistrict = `
            SELECT id as value, name as label
            FROM district
            WHERE provinceId = ? AND status != ?
            ORDER BY createAt DESC
        `
        const [district] = await pool.execute(getDistrict, [id, 'DELETED'])
        if (district.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ district })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}




module.exports = { createDistrict, updateDistrict, deleteDistrict, getDistrict, getDistrictSelect }