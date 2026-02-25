const pool = require("../db/db")
const cloudinary = require('../cloudinary/cloudinary')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const getNotification = async (req, res) => {
    const curId = req.currentUser.id

    try {

        const getNoti = `
            SELECT n.*, p.engName
            FROM notification n
            LEFT JOIN place p ON n.placeId = p.id
            WHERE n.userId = ?
            ORDER BY n.createAt DESC
        `
        const [result] = await pool.execute(getNoti, [curId])

        return res.json({ message: 'การแจ้งเตือน', result })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const delNotification = async (req, res) => {
    const { id } = req.params

    try {

        const delNoti = `
            DELETE FROM notification
            WHERE id = ?
        `
        await pool.execute(delNoti, [id])

        return res.json({ message: 'เสร็จสิ้น' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getSaveCount = async (req, res) => {
    const curId = req.currentUser.id

    try {
        const getSaveCount = `
            SELECT COUNT(s.id) AS saveCount
            FROM save s
            LEFT JOIN place p ON p.id = s.placeId
            WHERE s.userId = ? AND p.status != 'DELETED'
        `
        const [result] = await pool.execute(getSaveCount, [curId])

        return res.json({ result })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getNotiCount = async (req, res) => {
    const curId = req.currentUser.id

    try {
        const getNotiCount = `
            SELECT COUNT(id) AS notiCount
            FROM notification
            WHERE userId = ?
        `
        const [result] = await pool.execute(getNotiCount, [curId])

        return res.json({ result })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const clearAllNotification = async (req, res) => {
    const curId = req.currentUser.id

    try {

        const delNoti = `
            DELETE FROM notification
            WHERE userId = ?
        `
        await pool.execute(delNoti, [curId])

        return res.json({ message: 'เสร็จสิ้น' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}


module.exports = { getNotification, delNotification, getSaveCount, getNotiCount, clearAllNotification }