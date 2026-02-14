const pool = require("../db/db")
const cloudinary = require('../cloudinary/cloudinary')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const createPlaceRequest = async (req, res) => {
    const {
        thaiName, engName, placeType, address, province, district, subDistrict,
        phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType
    } = req.body
    const hasAllowance = req.body.hasAllowance === "true" ? 1 : 0
    const hasCaregiver = req.body.hasCaregiver === "true" ? 1 : 0
    const nearBts = req.body.nearBts === "true" ? 1 : 0
    const hasParking = req.body.hasParking === "true" ? 1 : 0

    const curId = req.currentUser.id

    try {
        if (!thaiName || !engName) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อบริษัทให้ครบ' })
        }
        if (!placeType) {
            return res.status(400).json({ message: 'กรุณาระบุประเภทองค์กร' })
        }
        if (!address || !province || !district || !subDistrict) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่อยู่ให้ครบ' })
        }
        if (workDay?.length === 0) {
            return res.status(400).json({ message: 'กรุณาระบุวันปฏิบัติงาน' })
        }
        if (workTime?.length === 0) {
            return res.status(400).json({ message: 'กรุณาระบุเวลาเริ่มงานและเลิกงาน' })
        }
        if (!workType) {
            return res.status(400).json({ message: 'กรุณาระบุรูปแบบการทำงาน' })
        }
        if (!dressType) {
            return res.status(400).json({ message: 'กรุณาระบุรูปแบบการแต่งกาย' })
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "กรุณาอัพโหลดรูปสถานที่ฝึก" });
        }

        const addPlaceRequest = `
            INSERT INTO place_request(
                id, placeRequestType, thaiName, engName, placeTypeId, address, province, district, subDistrict,
                phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
                nearBts, hasParking, workDay, workTime, workType, dressType, status, userId
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `
        const id = uuidv4()
        const [result] = await pool.execute(addPlaceRequest, [
            id, 'CREATE', thaiName, engName, placeType, address, province, district, subDistrict,
            phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
            nearBts, hasParking, workDay, workTime, workType, dressType, 'ACTIVE', curId
        ])

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "imgPlaceRequest",
            })

            const publicId = result.public_id
            const imgUrl = result.secure_url
            const placeRequestId = id

            const addImgPlaceRequest = `
                INSERT INTO img_place_request (
                    id, publicId, imgUrl, placeRequestId
                )
                VALUES (?, ?, ?, ?)
            `
            await pool.execute(addImgPlaceRequest, [uuidv4(), publicId, imgUrl, placeRequestId])

            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }

        // return res.json({ message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, workDay, workTime })
        return res.json({ message: 'ส่งคำขอสร้างสถานที่สำเร็จ' })

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

const updatePlaceNoImage = async (req, res) => {
    const {
        thaiName, engName, placeType, address, province, district, subDistrict,
        phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType,
        latitude, longitude, placeId, userId, placeRequestEditId
    } = req.body
    const hasAllowance = req.body.hasAllowance === "true" ? 1 : 0
    const hasCaregiver = req.body.hasCaregiver === "true" ? 1 : 0
    const nearBts = req.body.nearBts === "true" ? 1 : 0
    const hasParking = req.body.hasParking === "true" ? 1 : 0

    // const curId = req.currentUser.id

    try {
        if (!thaiName || !engName) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อบริษัทให้ครบ' })
        }
        if (!placeType) {
            return res.status(400).json({ message: 'กรุณาระบุประเภทองค์กร' })
        }
        if (!address || !province || !district || !subDistrict) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่อยู่ให้ครบ' })
        }
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'กรุณาระบุละติจูดและลองติจูดให้ครบ' })
        }
        if (!workDay) {
            return res.status(400).json({ message: 'กรุณาระบุวันปฏิบัติงาน' })
        }
        if (!workTime) {
            return res.status(400).json({ message: 'กรุณาระบุเวลาเริ่มงานและเลิกงาน' })
        }
        if (!workType) {
            return res.status(400).json({ message: 'กรุณาระบุรูปแบบการทำงาน' })
        }
        if (!dressType) {
            return res.status(400).json({ message: 'กรุณาระบุรูปแบบการแต่งกาย' })
        }
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)

        const updatePlace = `
            UPDATE place
            SET thaiName = ?, engName = ?, placeTypeId = ?, address = ?, provinceId = ?, districtId = ?, subDistrict = ?,
                phoneNumber = ?, email = ?, webSite = ?, facebook = ?, instagram = ?, hasAllowance = ?, hasCaregiver = ?,
                nearBts = ?, hasParking = ?, workDay = ?, workTime = ?, workType = ?, dressType = ?, latitude = ?, longitude = ?
            WHERE id = ?
        `
        const [result] = await pool.execute(updatePlace, [
            thaiName, engName, placeType, address, province, district, subDistrict,
            phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
            nearBts, hasParking, workDay, workTime, workType, dressType, lat, lng, placeId
        ])

        const delPlaceRequestEdit = `
            UPDATE place_request
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(delPlaceRequestEdit, ['DELETED', placeRequestEditId])

        const sendNotification = `
            INSERT INTO notification(
                id, notificationType, userId, status, placeId 
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        const notificationId = uuidv4()
        await pool.execute(sendNotification, [notificationId, 'EDITPASS', userId, 'ACTIVE', placeId])

        return res.json({
            message: 'อัพเดทสถานที่ฝึกสำเร็จ'
        })

        // return res.json({
        //     message: 'test', thaiName, engName, placeType, address, province, district, subDistrict,
        //     phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
        //     nearBts, hasParking, workDay, workTime, workType, dressType, lat, lng,
        //     placeId, userId, placeRequestEditId
        // })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const deletePlaceRequest = async (req, res) => {
    const { id } = req.params
    const { detail } = req.body

    try {
        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุเหตุผล' })
        }
        const checkPlaceRequest = `
            SELECT id, userId
            FROM place_request
            WHERE id = ? AND status != ?
        `
        const [result] = await pool.execute(checkPlaceRequest, [id, 'DELETED'])
        if (result.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }

        const getImg = `
            SELECT id, publicId
            FROM img_place_request
            WHERE placeRequestId = ?
        `
        const [image] = await pool.execute(getImg, [id])

        if (image.length > 0) {
            for (const img of image) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_place_request WHERE id = ?", [img.id])
            }
        }

        const updatePlaceRequest = `
            UPDATE place_request
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updatePlaceRequest, ['DELETED', id])

        const sendNotification = `
            INSERT INTO notification(
                id, notificationType, userId, status, detail 
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        const notificationId = uuidv4()
        await pool.execute(sendNotification, [notificationId, 'NO', result[0].userId, 'ACTIVE', detail])

        return res.json({ message: 'คำขอถูกลบแล้ว' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlaceRequest = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlaceRequest = `
            SELECT pr.id,
                pr.thaiName,
                pr.engName,
                u.id AS userId,
                u.username AS username
            FROM place_request pr
            LEFT JOIN user u ON pr.userId = u.id
            WHERE pr.status != 'DELETED'
            AND pr.placeRequestType = 'CREATE'
            AND (
                pr.thaiName LIKE ?
                OR pr.engName LIKE ?
            )
            ORDER BY pr.createAt DESC
            LIMIT ?
            OFFSET ?
        `;

        const keyword = `%${search}%`;

        const [result] = await pool.execute(getPlaceRequest, [keyword, keyword, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM place_request 
            WHERE status != 'DELETED' AND placeRequestType = 'CREATE'
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


const getPlaceRequestId = async (req, res) => {
    const { id } = req.params
    try {
        const getPlaceRequestId = `
            SELECT *
            FROM place_request
            WHERE id = ? AND status != ?
        `
        const [placeRequest] = await pool.execute(getPlaceRequestId, [id, 'DELETED'])
        if (placeRequest.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ placeRequest: placeRequest[0] })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const createPlaceRequestEdit = async (req, res) => {
    const {
        thaiName, engName, placeType, address, province, district, subDistrict, editPlaceId,
        phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType
    } = req.body
    const hasAllowance = req.body.hasAllowance === "true" ? 1 : 0
    const hasCaregiver = req.body.hasCaregiver === "true" ? 1 : 0
    const nearBts = req.body.nearBts === "true" ? 1 : 0
    const hasParking = req.body.hasParking === "true" ? 1 : 0

    const curId = req.currentUser.id

    try {
        if (!thaiName || !engName) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อบริษัทให้ครบ' })
        }
        if (!placeType) {
            return res.status(400).json({ message: 'กรุณาระบุประเภทองค์กร' })
        }
        if (!address || !province || !district || !subDistrict) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่อยู่ให้ครบ' })
        }
        if (workDay?.length === 0) {
            return res.status(400).json({ message: 'กรุณาระบุวันปฏิบัติงาน' })
        }
        if (workTime?.length === 0) {
            return res.status(400).json({ message: 'กรุณาระบุเวลาเริ่มงานและเลิกงาน' })
        }
        if (!workType) {
            return res.status(400).json({ message: 'กรุณาระบุรูปแบบการทำงาน' })
        }
        if (!dressType) {
            return res.status(400).json({ message: 'กรุณาระบุรูปแบบการแต่งกาย' })
        }

        const addPlaceRequestEdit = `
            INSERT INTO place_request(
                id, placeRequestType, editPlaceId, thaiName, engName, placeTypeId, address, province, district, subDistrict,
                phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
                nearBts, hasParking, workDay, workTime, workType, dressType, status, userId
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `
        const id = uuidv4()
        const [result] = await pool.execute(addPlaceRequestEdit, [
            id, 'EDIT', editPlaceId, thaiName, engName, placeType, address, province, district, subDistrict,
            phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
            nearBts, hasParking, workDay, workTime, workType, dressType, 'ACTIVE', curId
        ])

        // return res.json({ message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, workDay, workTime })
        // return res.json({
        //     message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, thaiName, engName, placeType, address, province, district, subDistrict,
        //     phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType, editPlaceId,
        //     hasAllowance, hasCaregiver, nearBts, hasParking, curId
        // })
        return res.json({ message: 'ส่งคำขอแก้ไขสถานที่สำเร็จ' })

    } catch (err) {
        console.log(err, 'ERROR')
        return res.status(500).json({
            error: err.message,
        })
    }
}

const getPlaceRequestEdit = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlaceRequest = `
            SELECT pr.id,
                pr.thaiName,
                pr.engName,
                pr.editPlaceId,
                u.id AS userId,
                u.username AS username
            FROM place_request pr
            LEFT JOIN user u ON pr.userId = u.id
            WHERE pr.status != 'DELETED'
            AND pr.placeRequestType = 'EDIT'
            AND (
                pr.thaiName LIKE ?
                OR pr.engName LIKE ?
            )
            ORDER BY pr.createAt DESC
            LIMIT ?
            OFFSET ?
        `;

        const keyword = `%${search}%`;

        const [result] = await pool.execute(getPlaceRequest, [keyword, keyword, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM place_request 
            WHERE status != 'DELETED' AND placeRequestType = 'EDIT'
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

const getPlaceRequestEditId = async (req, res) => {
    const { id } = req.params
    try {
        const getPlaceRequestId = `
            SELECT pr.*, pt.name AS placeType
            FROM place_request pr
            LEFT JOIN place_type pt ON pr.placeTypeId = pt.id
            WHERE pr.id = ? AND pr.status != ?
        `
        const [placeRequest] = await pool.execute(getPlaceRequestId, [id, 'DELETED'])
        if (placeRequest.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ placeRequest: placeRequest[0] })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const deletePlaceRequestEdit = async (req, res) => {
    const { id } = req.params
    const { detail } = req.body

    try {
        if (!detail) {
            return res.status(400).json({ message: 'กรุณาระบุเหตุผล' })
        }
        const checkPlaceRequest = `
            SELECT id, userId
            FROM place_request
            WHERE id = ? AND status != ?
        `
        const [result] = await pool.execute(checkPlaceRequest, [id, 'DELETED'])
        if (result.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }


        const updatePlaceRequestEdit = `
            UPDATE place_request
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updatePlaceRequestEdit, ['DELETED', id])

        const sendNotification = `
            INSERT INTO notification(
                id, notificationType, userId, status, detail 
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        const notificationId = uuidv4()
        await pool.execute(sendNotification, [notificationId, 'EDITNO', result[0].userId, 'ACTIVE', detail])

        return res.json({ message: 'คำขอถูกลบแล้ว' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}




module.exports = { createPlaceRequest, getPlaceRequest, getPlaceRequestId, deletePlaceRequest, createPlaceRequestEdit, getPlaceRequestEdit, getPlaceRequestEditId, updatePlaceNoImage, deletePlaceRequestEdit }