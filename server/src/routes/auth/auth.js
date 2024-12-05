import express from 'express';
const router = express.Router();

import {
    authorizeUser,
    generateSecret,
    generateToken, resetSecret,
    setSecret,
    verifyPassword
} from '../../controllers/authController.js';
import {readToken} from "./authMiddleware.js";
import {getHttpStatusCode} from "../../Errors.js";

router.post("/", readToken, (req, res) => {
    try {
        const user = authorizeUser(req.token);
        return res.status(200).json({
            success: true,
            user: user,
        });
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({ success: false, message: e.message });
    }

});
router.post("/sessions", async (req, res) => {
    const user = await verifyPassword(req.body.email, req.body.password);

    if (!user) {
        return res.status(401).json({success: false, message: 'Invalid credentials'});
    }

    const secret = generateSecret();
    const {hashedPassword, tokenSecret, ...safeUser} = user;
    const token = generateToken(safeUser, secret);

    setSecret(user.id, secret);

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
    });
});
router.delete("/sessions", readToken, async (req, res) => {
    try {
        const user = await authorizeUser(req.token);
        resetSecret(user.id);
        return res.status(200).json({
            success: true,
            message: 'Logout successful, token invalidated',
        });
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({success: false, message: e.message});
    }
});

export default router;