// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';

// const protectRoute = async (req, res, next) => {
//     try {
//         console.log("Cookies received:", req.cookies); // Debugging

//         const token = req.cookies?.jwt;
//         if (!token) {
//             return res.status(401).json({ error: "Unauthorized, token not provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded user ID:", decoded.userId);

//         if (!decoded?.userId) {
//             return res.status(401).json({ error: "Unauthorized, invalid token payload" });
//         }

//         const user = await User.findById(decoded.userId).select("-password");
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         if (error.name === "JsonWebTokenError") {
//             return res.status(401).json({ error: "Unauthorized, invalid token" });
//         } else if (error.name === "TokenExpiredError") {
//             return res.status(401).json({ error: "Unauthorized, token expired" });
//         }
//         console.error("Error in protectRoute:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export default protectRoute;


import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        console.log("Received Authorization Header:", authHeader); // Debugging

        if (!token) {
            return res.status(401).json({ error: "Unauthorized, token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded User ID:", decoded.id); // Debugging

        if (!decoded?.id) {
            return res.status(401).json({ error: "Unauthorized, invalid token payload" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Unauthorized, invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized, token expired" });
        }
        console.error("Error in protectRoute:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;
