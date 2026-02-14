const jwt = require('jsonwebtoken')


const middleware = async (req, res, next) => {
    const token = req.cookies.token

    try {

        if (token) {
            decoded = jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
                if (err) throw err;
                req.currentUser = result
                next()
            })
        }
        else {
            return res.status(401).json({ message: "No token." })
        }

    } catch (err) {
        console.log(err)
        res.clearCookie('token')
        return res.status(401).json({ message: "The token has expired." })
    }
}


module.exports = middleware;