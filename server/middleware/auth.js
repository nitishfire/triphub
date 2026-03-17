const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'triphub_super_secret_2024';

const authenticate = (type = null) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (type && decoded.type !== type)
      return res.status(403).json({ message: 'Access forbidden' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
