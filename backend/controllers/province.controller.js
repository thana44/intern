const pool = require("../db/db")
const { v4: uuidv4 } = require('uuid')

const createProvince = async (req, res) => {
    const { name } = req.body

    try {
        if (!name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อจังหวัด' })
        }
        const checkProvince = `
            SELECT id
            FROM province
            WHERE name = ? AND status != 'DELETED'
        `
        const [province] = await pool.execute(checkProvince, [name])
        if (province.length > 0) {
            return res.status(400).json({ message: "จังหวัดนี้มีอยู่ในระบบแล้ว" })
        }
        const addProvince = `
            INSERT INTO province(id, name, status) 
            VALUES (?, ?, ?)
        `
        await pool.execute(addProvince, [uuidv4(), name, 'ACTIVE'])

        return res.json({ message: 'เพิ่มจังหวัดสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const updateProvince = async (req, res) => {
    const { name } = req.body
    const { id } = req.params

    try {
        if (!name) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อจังหวัด' })
        }
        const checkProvince = `
            SELECT id
            FROM province
            WHERE name = ? AND status != 'DELETED'
        `
        const [province] = await pool.execute(checkProvince, [name])
        if (province.length > 0) {
            return res.status(400).json({ message: "จังหวัดนี้มีอยู่ในระบบแล้ว" })
        }
        const updateProvince = `
            UPDATE province
            SET name = ?
            WHERE id = ?
        `
        await pool.execute(updateProvince, [name, id])

        return res.json({ message: 'อัพเดทจังหวัดสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const deleteProvince = async (req, res) => {
    const { id } = req.params

    try {

         const checkDistrict = `
            SELECT id
            FROM district
            WHERE provinceId = ? AND status != 'DELETED'
        `
        const [district] = await pool.execute(checkDistrict, [id])

        if (district.length > 0) {
            return res.status(400).json({ message: "ไม่สามารถลบได้ เนื่องจากมีเขต/อำเภอที่ใช้งานจังหวัดนี้อยู่" })
        }

         const checkPlace = `
            SELECT id
            FROM place
            WHERE provinceId = ? AND status != 'DELETED'
        `
        const [place] = await pool.execute(checkPlace, [id])

        if (place.length > 0) {
            return res.status(400).json({ message: "ไม่สามารถลบได้ เนื่องจากมีสถานที่ใช้งานจังหวัดนี้อยู่" })
        }
        
        const checkProvince = `
            SELECT id
            FROM province
            WHERE id = ? AND status != ?
        `
        const [province] = await pool.execute(checkProvince, [id, 'DELETED'])
        if (province.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }
        const updateProvince = `
            UPDATE province
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updateProvince, ['DELETED', id])

        return res.json({ message: 'ลบจังหวัดสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getProvince = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlaceType = `
            SELECT id, name
            FROM province
            WHERE status != 'DELETED'
            AND name LIKE ?
            ORDER BY createAt DESC
            LIMIT ?
            OFFSET ?
        `
        const [result] = await pool.execute(getPlaceType, [`%${search}%`, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM province 
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


const getProvinceSelect = async (req, res) => {
    try {
        const getProvince = `
            SELECT id as value, name as label
            FROM province
            WHERE status != ?
            ORDER BY createAt DESC
        `
        const [province] = await pool.execute(getProvince, ['DELETED'])
        if (province.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ province })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getNameProvince = async (req, res) => {
    const { id } = req.params
    try {
        const getProvince = `
            SELECT name
            FROM province
            WHERE status != ? AND id = ?
        `
        const [province] = await pool.execute(getProvince, ['DELETED', id])
        if (province.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ province })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}




module.exports = { createProvince, updateProvince, deleteProvince, getProvince, getProvinceSelect, getNameProvince }