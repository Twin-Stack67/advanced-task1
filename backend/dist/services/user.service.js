"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreUser = exports.softDeleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = __importDefault(require("../models/User.model"));
const createUser = async (companyId, input) => {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existingUser = await User_model_1.default.findOne({ email: normalizedEmail, companyId });
    if (existingUser) {
        throw new Error('A user with this email already exists');
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(input.password, salt);
    const user = await User_model_1.default.create({
        ...input,
        email: normalizedEmail,
        password: hashedPassword,
        companyId,
        isDeleted: false,
    });
    return user;
};
exports.createUser = createUser;
const getUsers = async (companyId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {
        companyId,
        isDeleted: false,
    };
    if (query.role) {
        filter.role = query.role;
    }
    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
        ];
    }
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const [users, totalUsers] = await Promise.all([
        User_model_1.default.find(filter)
            .select('-password')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit),
        User_model_1.default.countDocuments(filter),
    ]);
    return {
        users,
        pagination: {
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            limit,
        },
    };
};
exports.getUsers = getUsers;
const getUserById = async (companyId, userId) => {
    const user = await User_model_1.default.findOne({
        _id: userId,
        companyId,
        isDeleted: false,
    }).select('-password');
    if (!user) {
        throw new Error('User not found or access denied');
    }
    return user;
};
exports.getUserById = getUserById;
const updateUser = async (companyId, userId, updateData) => {
    if (updateData.password) {
        const salt = await bcryptjs_1.default.genSalt(10);
        updateData.password = await bcryptjs_1.default.hash(updateData.password, salt);
    }
    const updatedUser = await User_model_1.default.findOneAndUpdate({ _id: userId, companyId, isDeleted: false }, { $set: updateData }, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
        throw new Error('User not found or access denied');
    }
    return updatedUser;
};
exports.updateUser = updateUser;
const softDeleteUser = async (companyId, userId) => {
    const deletedUser = await User_model_1.default.findOneAndUpdate({ _id: userId, companyId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true }).select('-password');
    if (!deletedUser) {
        throw new Error('User not found or access denied');
    }
    return deletedUser;
};
exports.softDeleteUser = softDeleteUser;
const restoreUser = async (companyId, userId) => {
    const restoredUser = await User_model_1.default.findOneAndUpdate({ _id: userId, companyId, isDeleted: true }, { $set: { isDeleted: false } }, { new: true }).select('-password');
    if (!restoredUser) {
        throw new Error('User not found or already active');
    }
    return restoredUser;
};
exports.restoreUser = restoreUser;
