const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {

    const authHeader = req.headers["authorization"];
    if (!authHeader) 
        return res.status(401).json({ error: "Authorization header missing" });

    const token = authHeader.split(" ")[1];

    if (!token) 
        return res.status(401).json({ error: "Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = verifyToken;
