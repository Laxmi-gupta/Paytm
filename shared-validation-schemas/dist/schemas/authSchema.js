"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
const zod_1 = require("zod");
const login = zod_1.z.object({
    email: zod_1.z.string().min(1, "Email is required").email({ message: "Invalid email format" }).trim(),
    password: zod_1.z.string().min(1, "Password is required")
});
const register = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().min(1, "Email is required").email({ message: "Invalid email format" }).trim(),
    password: zod_1.z.string().min(1, "Password is required"),
    number: zod_1.z.string().min(10).max(10).regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});
exports.authSchema = {
    login, register
};
//# sourceMappingURL=authSchema.js.map