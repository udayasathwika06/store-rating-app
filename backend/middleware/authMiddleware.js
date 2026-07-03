const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { sendResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendResponse(res, 401, false, 'Authentication failed: No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      }
    });

    if (!user) {
      return sendResponse(res, 401, false, 'Authentication failed: User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendResponse(res, 401, false, 'Authentication failed: Invalid or expired token');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, 'Access denied: Unauthorized role');
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
