import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import users from '../dataModules/usersModule.js';
import {BadRequestError, NotFoundError, UnauthorizedError} from "../Errors.js";

// Generate secret for JWT token
const generateSecret = () => {
    return crypto.randomBytes(50).toString('hex');
};

// Set secret of user
const setSecret = (userId, tokenSecret) => {
    const userIndex = users.findIndex(u => u.id === userId);
    users[userIndex]['tokenSecret'] = tokenSecret;
};

// Reset secret so token invalidates
const resetSecret = (userId) => {
    const userIndex = users.findIndex(u => u.id === userId);
    users[userIndex]['tokenSecret'] = "empty secret";
};

// Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Generate JWT token
const generateToken = (safeUser, tokenSecret) => {
    return jwt.sign({ user: safeUser }, tokenSecret);
};

// Authorize user
const authorizeUser = async (token) => {
    // Decode token
    let decoded;
    try {
        decoded = await jwt.decode(token);
    } catch {
        return BadRequestError('Token decoding failed');
    }

    // Check if token contains user and email
    if (!decoded || !decoded.user || !decoded.user.email) {
        throw new BadRequestError('Token does not contain user and or email');
    }

    // Find user with email
    const user = users.find(u => u.email === decoded.user.email);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Verify token
    return new Promise((resolve, reject) => {
        jwt.verify(token, user.tokenSecret, (err) => {
            if (err) {
                return reject(new UnauthorizedError('Token is invalid'));
            }
            resolve(user);
        });
    });
};

// Authorize admin
const authorizeAdmin = (user) => {
    if (user.role !== 'admin') {
        throw new UnauthorizedError('Unauthorized');
    }
    return true;
};

// Verify password
const verifyPassword = async (email, password) => {

    // Find user with email
    const user = users.find(u => u.email === email);

    if (!user) {
        return false;
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordCorrect) {
        return false;
    }

    // Password is correct
    return user;
};

export { generateSecret, setSecret, resetSecret, hashPassword, generateToken, authorizeUser, authorizeAdmin, verifyPassword };