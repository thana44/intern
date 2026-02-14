const pool = require("../db/db")
const cloudinary = require('../cloudinary/cloudinary')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const createPlace = async (req, res) => {
    const {
        thaiName, engName, placeType, address, province, district, subDistrict,
        phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType,
        latitude, longitude, placeRequestId, userId
    } = req.body
    const hasAllowance = req.body.hasAllowance === "true" ? 1 : 0
    const hasCaregiver = req.body.hasCaregiver === "true" ? 1 : 0
    const nearBts = req.body.nearBts === "true" ? 1 : 0
    const hasParking = req.body.hasParking === "true" ? 1 : 0
    const deletedImages = JSON.parse(req.body.deletedImages || "[]")
    const keepOldImages = JSON.parse(req.body.keepOldImages || "[]")

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
        if (keepOldImages.length === 0 && req.files.length === 0) {
            return res.status(400).json({ message: 'กรุณาอัพโหลดรูปสถานที่ฝึก' })
        }
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)

        if (deletedImages.length > 0) {
            for (const img of deletedImages) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_place_request WHERE id = ?", [img.id])
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "imgPlaceRequest",
                })

                const publicId = result.public_id
                const imgUrl = result.secure_url

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
        }

        const addPlace = `
            INSERT INTO place(
                id, thaiName, engName, placeTypeId, address, provinceId, districtId, subDistrict,
                phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
                nearBts, hasParking, workDay, workTime, workType, dressType, status, latitude, longitude, placeRequestId
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `
        const id = uuidv4()
        const [result] = await pool.execute(addPlace, [
            id, thaiName, engName, placeType, address, province, district, subDistrict,
            phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
            nearBts, hasParking, workDay, workTime, workType, dressType, 'ACTIVE', lat, lng, placeRequestId
        ])

        const delRequest = `
            UPDATE place_request
            SET status = 'DELETED'
            WHERE id = ?
        `
        await pool.execute(delRequest, [placeRequestId])

        const sendNotification = `
            INSERT INTO notification(
                id, notificationType, userId, status, placeId 
            )
            VALUES (
                ?, ?, ?, ?, ?
            )
        `
        const notificationId = uuidv4()
        await pool.execute(sendNotification, [notificationId, 'PASS', userId, 'ACTIVE', id])


        // return res.json({
        //     message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, thaiName, engName, placeType, address, province, district, subDistrict,
        //     phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType,
        //     latitude, longitude, hasAllowance, hasCaregiver, nearBts, hasParking, deletedImages, keepOldImages, placeRequestId, userId
        // })
        return res.json({
            message: 'เพิ่มสถานที่ฝึกสำเร็จ'
        })

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

const updatePlace = async (req, res) => {
    const {
        thaiName, engName, placeType, address, province, district, subDistrict,
        phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType,
        latitude, longitude, placeRequestId, placeId
    } = req.body
    const hasAllowance = req.body.hasAllowance === "true" ? 1 : 0
    const hasCaregiver = req.body.hasCaregiver === "true" ? 1 : 0
    const nearBts = req.body.nearBts === "true" ? 1 : 0
    const hasParking = req.body.hasParking === "true" ? 1 : 0
    const deletedImages = JSON.parse(req.body.deletedImages || "[]")
    const keepOldImages = JSON.parse(req.body.keepOldImages || "[]")

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
        if (keepOldImages.length === 0 && req.files.length === 0) {
            return res.status(400).json({ message: 'กรุณาอัพโหลดรูปสถานที่ฝึก' })
        }
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)

        if (deletedImages.length > 0) {
            for (const img of deletedImages) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_place_request WHERE id = ?", [img.id])
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "imgPlaceRequest",
                })

                const publicId = result.public_id
                const imgUrl = result.secure_url

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
        }

        const updatePlace = `
            UPDATE place
            SET thaiName = ?, engName = ?, placeTypeId = ?, address = ?, provinceId = ?, districtId = ?, subDistrict = ?,
                phoneNumber = ?, email = ?, webSite = ?, facebook = ?, instagram = ?, hasAllowance = ?, hasCaregiver = ?,
                nearBts = ?, hasParking = ?, workDay = ?, workTime = ?, workType = ?, dressType = ?, latitude = ?, longitude = ?,
                placeRequestId = ?
            WHERE id = ?
        `
        const [result] = await pool.execute(updatePlace, [
            thaiName, engName, placeType, address, province, district, subDistrict,
            phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
            nearBts, hasParking, workDay, workTime, workType, dressType, lat, lng, placeRequestId,
            placeId
        ])

        return res.json({
            message: 'อัพเดทสถานที่ฝึกสำเร็จ'
        })

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

const deletePlace = async (req, res) => {
    const { id } = req.params
    const { delPlaceRequestId } = req.body

    try {
        const checkPlace = `
            SELECT id
            FROM place
            WHERE id = ? AND status != ?
        `
        const [result] = await pool.execute(checkPlace, [id, 'DELETED'])
        if (result.length === 0) {
            return res.status(404).json({ message: "ข้อมูลนี้ถูกลบไปแล้ว" })
        }

        const getImg = `
            SELECT id, publicId
            FROM img_place_request
            WHERE placeRequestId = ?
        `
        const [image] = await pool.execute(getImg, [delPlaceRequestId])

        if (image.length > 0) {
            for (const img of image) {
                await cloudinary.uploader.destroy(img.publicId)
                await pool.execute("DELETE FROM img_place_request WHERE id = ?", [img.id])
            }
        }

        const updatePlace = `
            UPDATE place
            SET status = ?
            WHERE id = ?
        `
        await pool.execute(updatePlace, ['DELETED', id])

        const updateUser = `
            UPDATE user
            SET verifyAccount = ?
            WHERE myPlaceId = ?
        `
        await pool.execute(updateUser, [0, id])

        const checkEditRequest = `
            SELECT id
            FROM place_request
            WHERE editPlaceId = ?
        `;
        const [editRequest] = await pool.execute(checkEditRequest, [id]);

        if (editRequest.length > 0) {
            const delReport = `
                UPDATE place_request
                SET status = 'DELETED'
                WHERE editPlaceId = ?
            `;
            await pool.execute(delReport, [id]);
        }

        return res.json({ message: 'สถานที่ฝึกถูกลบแล้ว' })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlace = async (req, res) => {
    const { page, pageSize, search } = req.query

    try {
        const offset = (+page - 1) * +pageSize
        const limit = +pageSize

        const getPlace = `
            SELECT p.id,
                p.thaiName,
                p.engName,
                pt.name AS placeType,
                p.latitude,
                p.longitude,
                p.placeRequestId
            FROM place p
            LEFT JOIN place_type pt ON p.placeTypeId = pt.id
            WHERE p.status != 'DELETED'
            AND (
                p.thaiName LIKE ?
                OR p.engName LIKE ?
                OR pt.name LIKE ?
            )
            ORDER BY p.createAt DESC
            LIMIT ?
            OFFSET ?
        `;

        const keyword = `%${search}%`;

        const [result] = await pool.execute(getPlace, [keyword, keyword, keyword, `${limit}`, `${offset}`])

        const getCount = `
            SELECT COUNT(id) AS total 
            FROM place 
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


const getPlaceId = async (req, res) => {
    const { id } = req.params
    try {
        const getPlaceId = `
            SELECT *
            FROM place
            WHERE id = ? AND status != ?
        `
        const [place] = await pool.execute(getPlaceId, [id, 'DELETED'])
        if (place.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ place: place[0] })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const getPlaceIdReview = async (req, res) => {
    const { id } = req.params
    try {
        const getPlaceId = `
            SELECT p.*,
                pt.name AS placeType,
                pv.name AS province,
                d.name AS district,
                GROUP_CONCAT(DISTINCT s.userId SEPARATOR ' ') AS userSave
            FROM place p
            LEFT JOIN place_type pt ON p.placeTypeId = pt.id
            LEFT JOIN province pv ON p.provinceId = pv.id
            LEFT JOIN district d ON p.districtId = d.id
            LEFT JOIN save s ON s.placeId = p.id
            WHERE p.id = ? AND p.status != ?
            GROUP BY p.id
        `
        const [place] = await pool.execute(getPlaceId, [id, 'DELETED'])
        if (place.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({
            place: place.map((item) => ({
                ...item,
                userSave: item?.userSave?.split(' ') || []
            }))[0]
        })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}

const createPlaceNoRequest = async (req, res) => {
    const {
        thaiName, engName, placeType, address, province, district, subDistrict,
        phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType,
        latitude, longitude
    } = req.body
    const hasAllowance = req.body.hasAllowance === "true" ? 1 : 0
    const hasCaregiver = req.body.hasCaregiver === "true" ? 1 : 0
    const nearBts = req.body.nearBts === "true" ? 1 : 0
    const hasParking = req.body.hasParking === "true" ? 1 : 0

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

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "กรุณาอัพโหลดรูปสถานที่ฝึก" });
        }
        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        const genPlaceRequestId = uuidv4()

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "imgPlaceRequest",
                })

                const publicId = result.public_id
                const imgUrl = result.secure_url

                const addImgPlaceRequest = `
                INSERT INTO img_place_request (
                    id, publicId, imgUrl, placeRequestId
                )
                VALUES (?, ?, ?, ?)
            `
                await pool.execute(addImgPlaceRequest, [uuidv4(), publicId, imgUrl, genPlaceRequestId])

                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        const addPlace = `
            INSERT INTO place(
                id, thaiName, engName, placeTypeId, address, provinceId, districtId, subDistrict,
                phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
                nearBts, hasParking, workDay, workTime, workType, dressType, status, latitude, longitude, placeRequestId
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `
        const id = uuidv4()
        const [result] = await pool.execute(addPlace, [
            id, thaiName, engName, placeType, address, province, district, subDistrict,
            phoneNumber, email, webSite, facebook, instagram, hasAllowance, hasCaregiver,
            nearBts, hasParking, workDay, workTime, workType, dressType, 'ACTIVE', lat, lng, genPlaceRequestId
        ])

        // return res.json({
        //     message: 'เพิ่มเขต/อำเภอสำเร็จ', file: req.files, thaiName, engName, placeType, address, province, district, subDistrict,
        //     phoneNumber, email, webSite, facebook, instagram, workDay, workTime, workType, dressType,
        //     latitude, longitude, hasAllowance, hasCaregiver, nearBts, hasParking
        // })
        return res.json({
            message: 'เพิ่มสถานที่ฝึกสำเร็จ'
        })

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

const getPlaceFilter = async (req, res) => {
    const { provinceId, placeTypeId, rating, districtId, search } = req.body;

    try {
        let sql = `
      SELECT
        p.id,
        p.engName,
        pt.name AS placeType,
        d.name AS district,
        -- ปัดค่าเฉลี่ย rating เป็นทศนิยม 1 ตำแหน่ง
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
      WHERE 1=1 AND p.status != 'DELETED'
    `;

        const params = [];

        // 🔹 province
        if (provinceId) {
            sql += ` AND p.provinceId = ?`;
            params.push(provinceId);
        }

        // 🔹 place type
        if (placeTypeId) {
            sql += ` AND p.placeTypeId = ?`;
            params.push(placeTypeId);
        }

        // 🔹 search ชื่อสถานที่
        if (search) {
            sql += ` AND (p.engName LIKE ? OR p.thaiName LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        // 🔹 district (array จาก checkbox)
        if (Array.isArray(districtId) && districtId.length > 0) {
            sql += ` AND p.districtId IN (${districtId.map(() => '?').join(',')})`;
            params.push(...districtId);
        }

        // 🔹 group by (จำเป็นเพราะมี AVG / COUNT)
        sql += ` GROUP BY p.id`;

        // 🔹 rating (ต้องใช้ HAVING)
        if (rating) {
            sql += ` HAVING AVG(r.rating) >= ?`;
            params.push(rating);
        }

        // 🔹 optional: sort
        sql += ` ORDER BY avg_rating DESC`;

        const [rows] = await pool.execute(sql, params);

        return res.json({
            success: true,
            data: rows.map((item) => ({
                ...item,
                images: item?.images?.split(' ') || [],
                userSave: item?.userSave?.split(' ') || []
            }))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getPlaceSelect = async (req, res) => {
    try {
        const getPlace = `
            SELECT id as value, thaiName as label
            FROM place
            WHERE status != ?
            ORDER BY createAt DESC
        `
        const [place] = await pool.execute(getPlace, ['DELETED'])
        if (place.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" })
        }

        return res.json({ place })

    } catch (err) {
        console.log(err, 'ERROR')
    }
}



module.exports = { createPlace, getPlace, getPlaceId, updatePlace, deletePlace, getPlaceIdReview, createPlaceNoRequest, getPlaceFilter, getPlaceSelect }