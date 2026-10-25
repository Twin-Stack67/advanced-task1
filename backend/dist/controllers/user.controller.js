"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreEmployee = exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const user_service_1 = require("../services/user.service");
const createEmployee = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
        }
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email, and password',
            });
        }
        const user = await (0, user_service_1.createUser)(companyId, { name, email, password, role });
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return res.status(201).json({
            message: 'Employee created successfully',
            data: userObj,
        });
    }
    catch (error) {
        const err = error;
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }
        return res.status(400).json({ message: err.message || 'Failed to create employee' });
    }
};
exports.createEmployee = createEmployee;
const getEmployees = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
        }
        const query = {
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            search: req.query.search,
            role: req.query.role,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        };
        const result = await (0, user_service_1.getUsers)(companyId, query);
        return res.status(200).json({
            message: 'Employees retrieved successfully',
            data: result.users,
            pagination: result.pagination,
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ message: err.message || 'Failed to retrieve employees' });
    }
};
exports.getEmployees = getEmployees;
const getEmployeeById = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const id = req.params.id;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
        }
        const user = await (0, user_service_1.getUserById)(companyId, id);
        return res.status(200).json({
            message: 'Employee retrieved successfully',
            data: user,
        });
    }
    catch (error) {
        const err = error;
        return res.status(404).json({ message: err.message || 'Employee not found' });
    }
};
exports.getEmployeeById = getEmployeeById;
const updateEmployee = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const id = req.params.id;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
        }
        const { name, email, password, role } = req.body;
        const updatedUser = await (0, user_service_1.updateUser)(companyId, id, {
            name,
            email,
            password,
            role,
        });
        return res.status(200).json({
            message: 'Employee updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({ message: err.message || 'Failed to update employee' });
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const id = req.params.id;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
        }
        const deletedUser = await (0, user_service_1.softDeleteUser)(companyId, id);
        return res.status(200).json({
            message: 'Employee soft-deleted successfully',
            data: deletedUser,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({ message: err.message || 'Failed to delete employee' });
    }
};
exports.deleteEmployee = deleteEmployee;
const restoreEmployee = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const id = req.params.id;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant information missing' });
        }
        const restoredUser = await (0, user_service_1.restoreUser)(companyId, id);
        return res.status(200).json({
            message: 'Employee restored successfully',
            data: restoredUser,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({ message: err.message || 'Failed to restore employee' });
    }
};
exports.restoreEmployee = restoreEmployee;
