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
exports.loginUser = exports.registerCompanyWithAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Company_model_1 = __importDefault(require("../models/Company.model"));
const User_model_1 = __importStar(require("../models/User.model"));
const jwt_1 = require("../utils/jwt");
const registerCompanyWithAdmin = async (companyName, adminData) => {
    const normalizedEmail = adminData.email.trim().toLowerCase();
    // 1. Create Company
    const company = await Company_model_1.default.create({ name: companyName });
    // 2. Hash Password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(adminData.password, salt);
    // 3. Create Admin User linked to the Company ID
    const user = await User_model_1.default.create({
        ...adminData,
        email: normalizedEmail,
        password: hashedPassword,
        role: User_model_1.UserRole.ADMIN,
        companyId: company._id,
    });
    // 4. Generate JWT
    const token = (0, jwt_1.generateToken)({
        userId: user._id.toString(),
        companyId: company._id.toString(),
        role: user.role,
    });
    return { company, user, token };
};
exports.registerCompanyWithAdmin = registerCompanyWithAdmin;
const loginUser = async (email, pass) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User_model_1.default.findOne({ email: normalizedEmail, isDeleted: false });
    if (!user)
        throw new Error('Invalid credentials');
    const isMatch = await bcryptjs_1.default.compare(pass, user.password);
    if (!isMatch)
        throw new Error('Invalid credentials');
    const token = (0, jwt_1.generateToken)({
        userId: user._id.toString(),
        companyId: user.companyId.toString(),
        role: user.role,
    });
    return { user, token };
};
exports.loginUser = loginUser;
