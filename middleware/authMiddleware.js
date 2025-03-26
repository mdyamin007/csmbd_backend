const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Contains user id and email
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
