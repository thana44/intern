const adminMiddleware = (req, res, next) => {
    if (req.currentUser.role !== "ADMIN") {
        return res.status(403).json({
            message: "คุณไม่ได้เป็นผู้ดูแลระบบ",
        });
    }
    next();
};

module.exports = adminMiddleware;
