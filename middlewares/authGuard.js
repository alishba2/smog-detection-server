const jwt = require('jsonwebtoken');
const Technician = require('../models/Technician')
const authGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authorization denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  console.log(process.env.JWT_SECRET, "process.env.JWT_SECRET");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Payload:', decoded);

    const user = await Technician.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    res.status(401).json({ msg: 'Invalid or expired token.' });
  }
};



module.exports = authGuard;
