"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserPayload = exports.validateUserId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = require("../models/User.model");
const validateUserId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User ID format' });
    }
    next();
};
exports.validateUserId = validateUserId;
const validateUserPayload = (req, res, next) => {
    const { email, role, password } = req.body;
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
    }
    if (role && !Object.values(User_model_1.UserRole).includes(role)) {
        return res.status(400).json({
            message: `Invalid role. Allowed roles are: ${Object.values(User_model_1.UserRole).join(', ')}`,
        });
    }
    if (password && password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long',
        });
    }
    next();
};
exports.validateUserPayload = validateUserPayload;
