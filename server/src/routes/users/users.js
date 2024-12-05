import express from "express";
const router = express.Router();
import {
    checkIfEmailExists,
    createUser, getSafeUser,
    getUserById, updateUser,
    validateRegistrationData
} from "../../controllers/userController.js";
import {authorizeUser, generateToken, hashPassword} from "../../controllers/authController.js";
import {readToken} from "../auth/authMiddleware.js";
import {getHttpStatusCode} from "../../Errors.js";

router.get("/:id", (req, res) => {
    try {
        const id = req.params.id;
        const user = getSafeUser(getUserById(id));

        return res.status(200).json(user);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({ message: e.message });
    }


});
router.post("/", async (req, res) => {
    const {name, email, password} = req.body;
    try {
        validateRegistrationData(name, email, password);
        checkIfEmailExists(email);
        const hashedPassword = await hashPassword(password);
        const safeUser = createUser(name, email, hashedPassword);
        const user = getUserById(safeUser.id);
        const token = generateToken(user, user.tokenSecret);

        res.status(201).json({
        success: true,
        message: 'Registration successful, logged in',
        token: token,
    });

    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});
router.put("/" , readToken,async (req, res) => {
    try {
        const token = req.token;

        const safeUser = await authorizeUser(token);

        checkIfEmailExists(req.body.email);

        const {newSafeUser, newToken} = await updateUser(safeUser.id, req.body.name, req.body.email);

        res.status(200).json({
            success: true,
            message: 'User updated',
            user: newSafeUser,
            token: newToken,
        });
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});

export default router;