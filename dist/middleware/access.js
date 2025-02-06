"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.access = void 0;
const access = (req, res, next) => {
    console.log("Headers:", req.headers); // Debug headers
    console.log("Raw Body:", req.body); // Debug request body    
    const { API_TOKEN } = req.body;
    if (API_TOKEN !== process.env.API_TOKEN) {
        console.log("Invalid API_TOKEN received:", API_TOKEN);
        res.status(401).json({ error: "Unauthorized server request." });
        return;
    }
    next();
};
exports.access = access;
