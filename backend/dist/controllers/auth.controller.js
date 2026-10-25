"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerCompany = void 0;
const auth_service_1 = require("../services/auth.service");
/**
 * POST /api/auth/register
 * Registers a new company along with its initial Admin user.
 */
const registerCompany = async (req, res) => {
    try {
        const { companyName, name, email, password } = req.body;
        // Basic Input Validation
        if (!companyName || !name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide companyName, name, email, and password',
            });
        }
        // Invoke Service
        const { company, user, token } = await (0, auth_service_1.registerCompanyWithAdmin)(companyName, {
            name,
            email,
            password,
        });
        // Strip password from user response
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return res.status(201).json({
            message: 'Company and Admin user registered successfully',
            data: {
                company,
                user: userObj,
                token,
            },
        });
    }
    catch (error) {
        const err = error;
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email or company domain already exists' });
        }
        return res.status(400).json({ message: err.message || 'Registration failed' });
    }
};
exports.registerCompany = registerCompany;
/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Basic Input Validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password',
            });
        }
        // Invoke Service
        const { user, token } = await (0, auth_service_1.loginUser)(email, password);
        // Strip password from user response
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return res.status(200).json({
            message: 'Login successful',
            data: {
                user: userObj,
                token,
            },
        });
    }
    catch (error) {
        const err = error;
        return res.status(401).json({ message: err.message || 'Invalid credentials' });
    }
};
exports.login = login;
