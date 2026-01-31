import jwt from "jsonwebtoken";

const authMiddlewareFunction = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Token missing",
      });
    }
    
    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    console.log("Auth Error:", error.name);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddlewareFunction;