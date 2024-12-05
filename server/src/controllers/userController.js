import users from '../dataModules/usersModule.js';
import {generateSecret, generateToken} from "./authController.js";
import {BadRequestError, ConflictError, NotFoundError} from "../Errors.js";

const getSafeUser = (user) => {
    const { email, role, hashedPassword, tokenSecret, ...safeUser } = user;
    return safeUser;
};

// Get user by id
const getUserById = (userId) => {
    const user = users.find(user => user.id === parseInt(userId));
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
const nameRegex = /^[a-zA-Z]{2,}$/;

// Validate registration data
const validateRegistrationData = (name, email, password) => {

    if (!emailRegex.test(email)) {
        throw new BadRequestError('Invalid email format');
    }

    if (!passwordRegex.test(password)) {
        throw new BadRequestError('Password must be at least 8 characters, contain one uppercase letter and one special character.');
    }

    if (!nameRegex.test(name)) {
        throw new BadRequestError('Name must be at least 2 characters, only letters');
    }

    if (!name || !email || !password) {
        throw new BadRequestError('All fields (name, email, password) are required');
    }

    return true;
};

// Check if email exists
const checkIfEmailExists = (email) => {
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        throw new ConflictError('Email already exists');
    }

    return true;
};

// Create new user
const createUser = (name, email, hashedPassword) => {
    const tokenSecret = generateSecret();

    const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);

    const newUser = {
        id: maxId + 1,
        name,
        email,
        role: 'user',
        hashedPassword,
        tokenSecret
    };

    users.push(newUser);

    return getSafeUser(newUser);
};

// Update user
const updateUser = async (userId, name, email) => {
    const userIndex = users.findIndex(user => user.id === parseInt(userId));
    if (userIndex === -1) {
        throw new NotFoundError('User not found');
    }

    if (!email && !name) {
        throw new BadRequestError('At least one field (name, email) is required');
    }

    if (email) {
        if (!emailRegex.test(email)) {
            throw new BadRequestError('Invalid email format');
        }
        users[userIndex].email = email;
    }

    if (name) {
        if (!nameRegex.test(name)) {
            throw new BadRequestError('Name must be at least 2 characters, only letters');
        }
        users[userIndex].name = name;
    }

    const tokenSecret = generateSecret();
    users[userIndex].tokenSecret = tokenSecret;

    const {hashedPassword, tokenSecretRemove, ...safeUser} = users[userIndex];

    const newToken = await generateToken(safeUser, tokenSecret);

    const newSafeUser = getSafeUser(users[userIndex]);
    return {newSafeUser, newToken};
};

export {
    getSafeUser,
    getUserById,
    validateRegistrationData,
    checkIfEmailExists,
    createUser,
    updateUser
};
