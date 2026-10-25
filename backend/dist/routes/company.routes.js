"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_model_1 = require("../models/User.model");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN));
router.get('/stats', company_controller_1.getCompanyStats);
router.put('/', company_controller_1.updateCompany);
exports.default = router;
