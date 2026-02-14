const pool = require('../db/db')

const getDashboardStats = async (req, res) => {
    try {

        const companyQuery = `
            SELECT 
                pt.name,
                COUNT(p.id) AS value
            FROM place_type pt
            LEFT JOIN place p 
                ON p.placeTypeId = pt.id
                AND p.status != 'DELETED'
            WHERE pt.status != 'DELETED'
            GROUP BY pt.id
        `

        const ratingQuery = `
            SELECT 
                rating,
                COUNT(*) AS total,
                ROUND(
                    COUNT(*) * 100.0 /
                    (SELECT COUNT(*) FROM review WHERE status != 'DELETED'),
                    1
                ) AS percentage
            FROM review
            WHERE status != 'DELETED'
            GROUP BY rating
            ORDER BY rating DESC
        `

        const [companyData] = await pool.execute(companyQuery)
        const [ratingData] = await pool.execute(ratingQuery)

        return res.json({
            companyData,
            ratingData
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' })
    }
}

const getCountDash = async (req, res) => {
    try {

        const getUserCount = `
            SELECT COUNT(id) AS total 
            FROM user 
            WHERE status != 'DELETED'
        `;
        const [userResult] = await pool.execute(getUserCount, []);
        const users = userResult[0].total

        const getPlaceCount = `
            SELECT COUNT(id) AS total 
            FROM place 
            WHERE status != 'DELETED'
        `;
        const [placeResult] = await pool.execute(getPlaceCount, []);
        const places = placeResult[0].total

        const getReviewCount = `
            SELECT COUNT(id) AS total 
            FROM review 
            WHERE status != 'DELETED'
        `;
        const [reviewResult] = await pool.execute(getReviewCount, []);
        const reviews = reviewResult[0].total

        return res.json({ users, places, reviews })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' })
    }
}



module.exports = { getDashboardStats, getCountDash }