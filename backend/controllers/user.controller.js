const pool = require("../db/db")
const fs = require('fs')
const cloudinary = require('../cloudinary/cloudinary')
const { v4: uuidv4 } = require('uuid')

const getProfile = async (req, res) => {
    const { id } = req.params

    try {
        const getProfile = `
            SELECT profileImg, username, firstName, lastName, aboutMe, phoneNumber, email, facebook, instagram
            FROM user
            WHERE id = ?
        `
        const [profile] = await pool.execute(getProfile, [id])
        if (profile.length === 0) {
            return res.status(404).json({ message: "Not found." })
        }
        return res.json({ profile })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getProfileForUpdate = async (req, res) => {
    const { id } = req.params
    const curId = req.currentUser.id

    try {
        if (id !== curId) {
            res.clearCookie('token')
            return res.status(401).json({ message: "The token has expired." })
        }
        const getProfile = `
            SELECT profileImg, username, firstName, lastName, aboutMe, phoneNumber, email, facebook, instagram
            FROM user
            WHERE id = ?
        `
        const [profile] = await pool.execute(getProfile, [curId])
        return res.json({ message: 'pass', profile })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const updateProfile = async (req, res) => {
    const { username, firstName, lastName, aboutMe, phoneNumber, email, facebook, instagram } = req.body
    const curId = req.currentUser.id
    const { id } = req.params

    try {
        if (id !== curId) {
            res.clearCookie('token')
            return res.status(401).json({ message: "The token has expired." })
        }

        if (!username) {
            return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้" })
        }

        if (!email) {
            return res.status(400).json({ message: "กรุณากรอกอีเมล" })
        }

        const checkUsername = `
            SELECT id
            FROM user 
            WHERE username = ?
        `
        const [nameId] = await pool.execute(checkUsername, [username])
        if (nameId?.length > 0) {
            if (nameId[0]?.id !== curId) {
                return res.status(400).json({ message: "ชื่อผู้ใช้นี้มีอยู่แล้ว" })
            }
        }

        const checkEmail = `
            SELECT id
            FROM user 
            WHERE email = ?
        `
        const [emailId] = await pool.execute(checkEmail, [email])
        if (emailId?.length > 0) {
            if (emailId[0]?.id !== curId) {
                return res.status(400).json({ message: "อีเมลนี้มีอยู่แล้ว" })
            }
        }

        if (req.file) {
            const getProfileId = `
                SELECT profileId
                FROM user
                WHERE id = ?
            `
            const [profileId] = await pool.execute(getProfileId, [curId])
            if (profileId[0]?.profileId) {
                await cloudinary.uploader.destroy(profileId[0]?.profileId)
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile',
            })

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            const imageUrl = result.secure_url
            const imageId = result.public_id

            const updateImage = `
                UPDATE user
                SET profileId = ?, profileImg = ?
                WHERE id = ?
            `
            await pool.execute(updateImage, [imageId, imageUrl, curId])
        }

        const updateProfile = `
            UPDATE user
            SET username = ?, firstName = ?, lastName = ?, aboutMe = ?, phoneNumber = ?, email = ?, facebook = ?, instagram = ?
            WHERE id = ?
        `
        await pool.execute(updateProfile, [username, firstName, lastName, aboutMe, phoneNumber, email, facebook, instagram, curId])

        return res.json({ message: "อัพเดทโปรไฟล์สำเร็จ" })

    } catch (err) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            message: 'Upload failed',
            error: err.message,
        })
    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
}

const sendRequestVerifyAccount = async (req, res) => {
    const { studentId, fullName, placeId } = req.body
    const curId = req.currentUser.id

    try {

        if (!studentId || !fullName || !placeId) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' })
        }

        const checkRequest = `
            SELECT id
            FROM verify_account_request
            WHERE userId = ?
        `
        const [request] = await pool.execute(checkRequest, [curId])
        if (request.length > 0) {
            return res.status(400).json({ message: 'คุณได้ส่งคำขอยืนยันตัวตนไปแล้ว' })
        }

        const id = uuidv4()
        const createRequest = `
            INSERT INTO verify_account_request(
                id, userId, studentId, fullName, placeId
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        await pool.execute(createRequest, [id, curId, studentId, fullName, placeId])

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "imgRequestVerifyAccount",
                })

                const publicId = result.public_id
                const imgUrl = result.secure_url

                const addImgRequest = `
                    UPDATE verify_account_request
                    SET publicId = ?, imgUrl = ?
                    WHERE id = ?
                `
                await pool.execute(addImgRequest, [publicId, imgUrl, id])

            }
        }

        // return res.json({ message: 'ส่งคำขอยืนยันตัว', file: req.files, studentId, fullName, placeName, curId })
        return res.json({ message: 'ส่งคำขอยืนยันตัวตนสำเร็จ' })

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

const getRequestVerifyAccount = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlaceType = `
            SELECT vr.*,
                u.username AS username,
                p.thaiName AS thaiName
            FROM verify_account_request vr
            LEFT JOIN user u ON u.id = vr.userId
            LEFT JOIN place p ON p.id = vr.placeId
            WHERE p.thaiName LIKE ? OR u.username LIKE ?
            ORDER BY vr.createAt DESC
            LIMIT ?
            OFFSET ?
        `
        const [result] = await pool.execute(getPlaceType, [`%${search}%`, `%${search}%`, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM verify_account_request 
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

const deleteRequestVerifyAccount = async (req, res) => {
    const { id } = req.params
    const { detail, userId } = req.body

    try {

        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุเหตุผล' })
        }
        const checkRequest = `
            SELECT id, publicId
            FROM verify_account_request
            WHERE id = ?
        `
        const [result] = await pool.execute(checkRequest, [id])
        if (result.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }

        if (result[0].publicId) {
            await cloudinary.uploader.destroy(result[0].publicId)
        }

        const delRequest = `
            DELETE
            FROM verify_account_request
            WHERE id = ?
        `
        await pool.execute(delRequest, [id])

        const sendNotification = `
            INSERT INTO notification(
                id, notificationType, userId, status, detail 
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        await pool.execute(sendNotification, [uuidv4(), 'VERIFYNO', userId, 'ACTIVE', detail])

        return res.json({ message: 'คำขอยืนยันตัวตนถูกลบแล้ว' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const onVerifySuccess = async (req, res) => {
    const { id } = req.params
    const { userId, placeId } = req.body

    try {

        const checkRequest = `
            SELECT id, publicId
            FROM verify_account_request
            WHERE id = ?
        `
        const [result] = await pool.execute(checkRequest, [id])
        if (result.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }

        if (result[0].publicId) {
            await cloudinary.uploader.destroy(result[0].publicId)
        }

        const delRequest = `
            DELETE
            FROM verify_account_request
            WHERE id = ?
        `
        await pool.execute(delRequest, [id])

        const updateUser = `
            UPDATE user
            SET verifyAccount = ?, myPlaceId = ?
            WHERE id = ?
        `
        await pool.execute(updateUser, [1, placeId, userId])

        const sendNotification = `
            INSERT INTO notification(
                id, notificationType, userId, status, placeId 
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        await pool.execute(sendNotification, [uuidv4(), 'VERIFYPASS', userId, 'ACTIVE', placeId])

        return res.json({ message: 'ยืนยันตัวตนสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const reportUser = async (req, res) => {
    const { userId } = req.params
    const { detail } = req.body
    const curId = req.currentUser.id

    try {

        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุสาเหตุ' })
        }

        const checkReport = `
            SELECT id
            FROM report_user
            WHERE userId = ? AND reportById = ? AND status != 'DELETED'
        `
        const [result] = await pool.execute(checkReport, [userId, curId])

        if (result.length > 0) {
            return res.status(400).json({ message: 'คุณได้รายงานบัญชีนี้แล้ว' })
        }

        const addReportUser = `
            INSERT INTO report_user (id, userId, detail, reportById, status)
            VALUES (?, ?, ?, ?, ?)
        `
        await pool.execute(addReportUser, [uuidv4(), userId, detail, curId, 'ACTIVE'])

        return res.json({ message: 'เสร็จสิ้น' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

const getReportUser = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getReport = `
            SELECT 
                ru.*,
                profile.username AS profileName,
                reporter.username AS reporterName

            FROM report_user ru

            LEFT JOIN user profile 
                ON profile.id = ru.userId

            LEFT JOIN user reporter 
                ON reporter.id = ru.reportById

            WHERE ru.status != 'DELETED'
            AND (
                reporter.username LIKE ?
                OR profile.username LIKE ?
            )

            ORDER BY ru.createAt DESC
            LIMIT ?
            OFFSET ?
        `

        const [result] = await pool.execute(getReport, [`%${search}%`, `%${search}%`, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM report_user 
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

const delReportUser = async (req, res) => {
    const { reportId } = req.params

    try {

        const checkReport = `
            SELECT id
            FROM report_user
            WHERE id = ?
        `
        const [result] = await pool.execute(checkReport, [reportId])

        if (result.length === 0) {
            return res.status(400).json({ message: 'ไม่พบรายงาน' })
        }

        const delReport = `
            DELETE
            FROM report_user
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

const blockUserFromReport = async (req, res) => {
    const { reportId } = req.params
    const { userId } = req.body

    try {

        const checkUser = `
            SELECT id
            FROM user
            WHERE id = ? AND status != 'DELETED'
        `
        const [result] = await pool.execute(checkUser, [userId])

        if (result.length === 0) {
            return res.status(400).json({ message: 'บัญชีนี้ถูกระงับไปแล้ว' })
        }

        const blockUser = `
            UPDATE user
            SET status = 'DELETED'
            WHERE id = ?
        `
        await pool.execute(blockUser, [userId])

        const delReport = `
            DELETE
            FROM report_user
            WHERE id = ?
        `
        await pool.execute(delReport, [reportId])

        return res.json({ message: 'ระงับบัญชีสำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const getUserPaginate = async (req, res) => {
    const { page, pageSize, search } = req.query
    const curId = req.currentUser.id

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPaginate = `
            SELECT 
                id, username, verifyAccount, role
            FROM user
            WHERE status != 'DELETED' AND username LIKE ? AND id != ?
            ORDER BY createAt DESC
            LIMIT ?
            OFFSET ?
        `

        const [result] = await pool.execute(getPaginate, [`%${search}%`, curId, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM user
            WHERE status != 'DELETED' AND id != ?
        `;
        const [countResult] = await pool.execute(getCount, [curId]);
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

const blockUserFromAll = async (req, res) => {
    const { userId } = req.params;

    try {
        const checkUser = `
            SELECT id
            FROM user
            WHERE id = ? AND status != 'DELETED'
        `;
        const [result] = await pool.execute(checkUser, [userId]);

        if (result.length === 0) {
            return res.status(400).json({ message: 'บัญชีนี้ถูกระงับไปแล้ว' });
        }

        const blockUser = `
            UPDATE user
            SET status = 'DELETED'
            WHERE id = ?
        `;
        await pool.execute(blockUser, [userId]);

        const checkReport = `
            SELECT id
            FROM report_user
            WHERE userId = ?
        `;
        const [reportResult] = await pool.execute(checkReport, [userId]);

        if (reportResult.length > 0) {
            const delReport = `
                DELETE
                FROM report_user
                WHERE userId = ?
            `;
            await pool.execute(delReport, [userId]);
        }

        return res.json({ message: 'ระงับบัญชีสำเร็จ' });

    } catch (err) {
        console.log(err, 'ERROR');
        return res.status(500).json({
            error: err.message,
        });
    }
};


module.exports = { getProfile, getProfileForUpdate, updateProfile, sendRequestVerifyAccount, getRequestVerifyAccount, deleteRequestVerifyAccount, onVerifySuccess, reportUser, getReportUser, delReportUser, blockUserFromReport, getUserPaginate, blockUserFromAll }