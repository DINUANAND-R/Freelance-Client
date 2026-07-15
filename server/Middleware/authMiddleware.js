// server/Middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT in the Authorization header.
 * On success, attaches decoded payload to req.user.
 * On failure, returns 401 Unauthorized.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role, iat, exp }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

/**
 * Role guard factory — use after authMiddleware.
 * Example: router.get('/admin-only', authMiddleware, requireRole('admin'), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
    next();
};

module.exports = { authMiddleware, requireRole };
