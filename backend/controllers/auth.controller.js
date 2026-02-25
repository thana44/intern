const pool = require("../db/db")
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleConnectDB = async () => {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected');
    conn.release();
}
handleConnectDB()

const registerController = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const profileImgUrl = "https://i.pinimg.com/736x/1c/43/4d/1c434d1640f9572e2ac7be5c6bac9348.jpg";

    try {

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "กรุณาป้อนข้อมูลทั้งหมด" })
        }

        if (username.length > 10) {
            return res.status(400).json({ message: "ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 10 ตัวอักษร" })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "รูปแบบอีเมลไม่ถูกต้อง" })
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก ตัวเลข และอักขระพิเศษ @$!%*?&" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "รหัสผ่านไม่ตรงกัน" })
        }

        const checkUsername = 'SELECT id FROM user WHERE username = ?'
        const [nameId] = await pool.execute(checkUsername, [username])
        if (nameId?.length > 0) {
            return res.status(400).json({ message: "ชื่อผู้ใช้นี้มีอยู่แล้ว" })
        }

        const checkEmail = 'SELECT id FROM user WHERE email = ?'
        const [emailId] = await pool.execute(checkEmail, [email])
        if (emailId?.length > 0) {
            return res.status(400).json({ message: "อีเมลนี้มีอยู่แล้ว" })
        }

        const id = uuidv4()
        const salt = bcrypt.genSaltSync(15)
        const hashPassword = bcrypt.hashSync(password, salt)
        const addUser = 'INSERT INTO user(id, username, email, password, profileImg, role, status, verifyAccount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        const [result] = await pool.execute(addUser, [
            id,
            username,
            email,
            hashPassword,
            profileImgUrl,
            'USER',
            'ACTIVE',
            0
        ])

        const addNotification = `
            INSERT INTO notification (id, notificationType, detail, userId, status)
            VALUES (?, ?, ?, ?, ?)
        `
        await pool.execute(addNotification, [uuidv4(), 'VERIFYACCOUNT', 'หากไม่พบสถานที่ฝึก คุณสามารถส่งคำขอสร้างสถานที่ฝึกได้', id, 'ACTIVE'])

        return res.status(201).json({ message: "Successful registration." })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const loginController = async (req, res) => {
    const { username, password } = req.body

    try {

        if (!username || !password) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลทั้งหมด" })
        }

        const getUser = 'SELECT id, username, password, profileImg, role, status FROM user WHERE username = ?'
        const [result] = await pool.execute(getUser, [username])
        if (result?.length === 0) {
            return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" })
        }

        const checkPassword = bcrypt.compareSync(password, result[0].password)
        if (!checkPassword) {
            return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" })
        }

        if (result[0].status === 'DELETED') {
            return res.status(401).json({ message: "บัญชีของคุณถูกระงับแล้ว" })
        }

        const token = jwt.sign({ id: result[0].id, username: result[0].username, profileImg: result[0].profileImg, role: result[0].role, status: result[0].status }, process.env.JWT_SECRET, { expiresIn: '24h' })

        return res.cookie('token', token, { httpOnly: true }).status(200).json({ message: "Login successful.", token })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const logOutController = async (req, res) => {
    try {

        res.clearCookie('token')

        return res.status(200).json({ message: 'Logged out' });

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getCurrentUserController = async (req, res) => {
    const { id } = req.currentUser

    try {

        const getCurrentUser = 'SELECT id, username, profileImg, email, role, googleId, myPlaceId, verifyAccount FROM user WHERE id = ?'
        const [result] = await pool.execute(getCurrentUser, [id])

        return res.json({ currentUser: result[0] })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const resetPassword = async (req, res) => {
    const { id } = req.currentUser
    const { oldPassword, newPassword, confirmPassword } = req.body

    try {

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลทั้งหมด" })
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก ตัวเลข และอักขระพิเศษ" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "รหัสผ่านไม่ตรงกัน" })
        }

        const getUser = `
            SELECT id, username, password, profileImg, role, status 
            FROM user 
            WHERE id = ? AND status != 'DELETED'
        `
        const [result] = await pool.execute(getUser, [id])

        if (result?.length === 0) {
            return res.status(401).json({ message: "ไม่พบบัญชี" })
        }

        const checkPassword = bcrypt.compareSync(oldPassword, result[0].password)
        if (!checkPassword) {
            return res.status(401).json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" })
        }

        const salt = bcrypt.genSaltSync(15)
        const hashPassword = bcrypt.hashSync(newPassword, salt)
        const resetPass = `
            UPDATE user
            SET password = ?
            WHERE id = ? AND status != 'DELETED'
        `
        await pool.execute(resetPass, [hashPassword, id])

        return res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const checkToken = async (req, res) => {
    try {
        return res.json({ status: true })
    } catch (err) {
        console.log(err)
    }
}

const IsAdmin = async (req, res) => {
    try {
        return res.json({ status: true })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { registerController, loginController, getCurrentUserController, logOutController, resetPassword, checkToken, IsAdmin }