"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: 'individual'
    },
    status: {
        type: String,
        default: 'ongoing'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
exports.UserModel = mongoose_1.model('User', exports.UserSchema);
//# sourceMappingURL=UserSchema.js.map