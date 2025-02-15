const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.session.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    if (req.xhr) {
      return res.status(401).json({ error: 'No token provided' });
    }
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    if (req.xhr) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.redirect('/login');
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.isAdmin) {
    if (req.xhr) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    return res.redirect('/');
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };