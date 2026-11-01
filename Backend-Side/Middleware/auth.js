import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Login zaroori
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Pehle login karo" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User nahi mila" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Session expire ho gaya, dobara login karo" });
  }
}

// Sirf diye gaye roles ko allow karo: requireRole("volunteer") ya requireRole("user", "volunteer")
// requireAuth ke BAAD lagana
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Is page ka access aapko nahi hai" });
    }
    next();
  };
}

// Sirf admin ke liye
export const requireAdmin = requireRole("admin");
