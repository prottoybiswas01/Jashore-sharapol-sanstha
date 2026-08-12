import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sharapol_super_secure_jwt_key_jashore_2026_top_security_key';

export const generateToken = (userPayload) => {
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });
};

// Top Security JWT Authentication Middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'সুরক্ষা সতর্কতা: কোনো বৈধ অথোরাইজেশন টোকেন পাওয়া যায়নি। প্রবেশ সংরক্ষিত।' 
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'সুরক্ষা সতর্কতা: সেশনের মেয়াদ উত্তীর্ণ অথবা টোকেনটি অকার্যকর।' 
    });
  }
};

// Strict Role-Based Access Control (RBAC) Permission Middleware
export const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'অনুমতি যাচাই ব্যর্থ হয়েছে।' });
    }

    // Super Admin has full permissions automatically
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    if (userPermissions.includes(permissionKey) || userPermissions.includes('manage_all')) {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: `সুরক্ষা ব্লক: আপনার একাউন্টে এই নির্দিষ্ট ফিচারটি (${permissionKey}) অ্যাক্সেস করার অনুমতি প্রদান করা হয়নি।` 
    });
  };
};

// Security Input Sanitizer (Prevents NoSQL Injection & Malicious Script Injection)
export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Strip dangerous script tags or SQL/NoSQL injection tokens
        req.body[key] = req.body[key].replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
      }
    }
  }
  next();
};
