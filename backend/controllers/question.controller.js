const pool = require("../db/db")
const { v4: uuidv4 } = require('uuid')

const createQuestion = async (req, res) => {
    const { title, answer } = req.body

    try {
        if (!title || !answer) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลทั้งหมด' })
        }
        const addQuestion = `
            INSERT INTO question(
                id, title, answer
            )
            VALUES (
                ?, ?, ?
            )
        `
        await pool.execute(addQuestion, [uuidv4(), title, answer])

        return res.json({ message: 'เพิ่มคำถามสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const updateQuestion = async (req, res) => {
    const { title, answer } = req.body
    const { id } = req.params

    try {
        if (!title || !answer) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลทั้งหมด' })
        }

        const updateQuestion = `
            UPDATE question
            SET title = ?, answer = ?
            WHERE id = ?
        `
        await pool.execute(updateQuestion, [title, answer, id])

        return res.json({ message: 'อัพเดทคำถามสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const deleteQuestion = async (req, res) => {
    const { id } = req.params

    try {
        const delQuestion = `
            DELETE FROM question
            WHERE id = ?
        `
        await pool.execute(delQuestion, [id])

        return res.json({ message: 'ลบคำถามสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getQuestion = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getQuestion = `
            SELECT id, title, answer
            FROM question
            WHERE title LIKE ? OR answer LIKE ?
            ORDER BY createAt DESC
            LIMIT ?
            OFFSET ?
        `
        const keyword = `%${search}%`;
        const [result] = await pool.execute(getQuestion, [keyword, keyword, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM question 
        `;
        const [countResult] = await pool.execute(getCount, []);
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

const getShowQuestion = async (req, res) => {

    try {

        const getShowQuestion = `
            SELECT *
            FROM question
            ORDER BY createAt DESC
        `
        const [result] = await pool.execute(getShowQuestion, [])

        return res.json({ result })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}


module.exports = { createQuestion, getQuestion, updateQuestion, deleteQuestion, getShowQuestion }