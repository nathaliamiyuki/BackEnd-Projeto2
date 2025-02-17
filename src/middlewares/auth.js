const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.session.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.isAdmin) {
        return res.redirect('/');
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };