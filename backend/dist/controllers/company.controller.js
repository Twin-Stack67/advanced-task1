"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompany = exports.getCompanyStats = void 0;
const Company_model_1 = __importDefault(require("../models/Company.model"));
const User_model_1 = __importStar(require("../models/User.model"));
const getCompanyStats = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant info missing' });
        }
        const company = await Company_model_1.default.findById(companyId);
        if (!company || company.isDeleted) {
            return res.status(404).json({ message: 'Company not found' });
        }
        const [totalActive, totalDeleted, managersCount, employeesCount] = await Promise.all([
            User_model_1.default.countDocuments({ companyId, isDeleted: false }),
            User_model_1.default.countDocuments({ companyId, isDeleted: true }),
            User_model_1.default.countDocuments({ companyId, role: User_model_1.UserRole.MANAGER, isDeleted: false }),
            User_model_1.default.countDocuments({ companyId, role: User_model_1.UserRole.EMPLOYEE, isDeleted: false }),
        ]);
        return res.status(200).json({
            message: 'Company stats retrieved successfully',
            data: {
                company,
                metrics: {
                    totalActiveUsers: totalActive,
                    totalDeletedUsers: totalDeleted,
                    managersCount,
                    employeesCount,
                },
            },
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ message: err.message || 'Failed to retrieve stats' });
    }
};
exports.getCompanyStats = getCompanyStats;
const updateCompany = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const { name, domain } = req.body;
        const company = await Company_model_1.default.findByIdAndUpdate(companyId, { $set: { name, domain } }, { new: true, runValidators: true });
        return res.status(200).json({
            message: 'Company updated successfully',
            data: company,
        });
    }
    catch (error) {
        const err = error;
        return res.status(400).json({ message: err.message || 'Failed to update company' });
    }
};
exports.updateCompany = updateCompany;
