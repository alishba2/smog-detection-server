const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Authorization denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; 
    next(); 
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ msg: 'Invalid or expired token.' });
  }
};

module.exports = authGuard;
