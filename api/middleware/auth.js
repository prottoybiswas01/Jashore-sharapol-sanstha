import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sharapol_secret_jwt_key_jashore_2026';

export const generateToken = (userPayload) => {
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'লগইন অনুমোদিত নয়। টোকেন অনুপস্থিত।' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'সেশন মেয়াদোত্তীর্ণ অথবা অকার্যকর টোকেন।' });
  }
};

// Role-Based Access Control (RBAC) Permission Middleware
export const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'অনুমতি নিশ্চিত করা যায়নি।' });
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
      message: `আপনার এই কাজটি সম্পাদনের সুনির্দিষ্ট অনুমতি (${permissionKey}) নেই। অনুগ্রহ করে সুপার এডমিনের সাথে যোগাযোগ করুন।` 
    });
  };
};
