const multer = require('multer')
const path = require('path')
const fs = require('fs')

// โฟลเดอร์เก็บไฟล์ชั่วคราว
const uploadDir = 'uploads'

// ถ้ายังไม่มีโฟลเดอร์ ให้สร้าง
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// ตั้งค่า diskStorage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueName + path.extname(file.originalname))
    },
})

// กรองเฉพาะรูป
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed'), false)
    }
}

// สร้าง multer instance
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
})

module.exports = upload
