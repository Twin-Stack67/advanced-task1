"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_middleware_1 = require("../middlewares/user.middleware");
const User_model_1 = require("../models/User.model");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN, User_model_1.UserRole.MANAGER), user_middleware_1.validateUserPayload, user_controller_1.createEmployee);
router.get('/', (0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN, User_model_1.UserRole.MANAGER, User_model_1.UserRole.EMPLOYEE), user_controller_1.getEmployees);
router.get('/:id', (0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN, User_model_1.UserRole.MANAGER, User_model_1.UserRole.EMPLOYEE), user_middleware_1.validateUserId, user_controller_1.getEmployeeById);
router.put('/:id', (0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN, User_model_1.UserRole.MANAGER), user_middleware_1.validateUserId, user_middleware_1.validateUserPayload, user_controller_1.updateEmployee);
router.delete('/:id', (0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN), user_middleware_1.validateUserId, user_controller_1.deleteEmployee);
router.patch('/:id/restore', (0, auth_middleware_1.authorizeRoles)(User_model_1.UserRole.ADMIN), user_middleware_1.validateUserId, user_controller_1.restoreEmployee);
exports.default = router;
