"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserSchema_1;
const mongoose_1 = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const inversify_1 = require("inversify");
let UserSchema = UserSchema_1 = class UserSchema {
    getModel() {
        return mongoose_1.model('User', UserSchema_1._schema);
    }
};
UserSchema._schema = new mongoose_1.Schema({
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
    accessToken: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    points: {
        type: Number,
        default: 0
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}).plugin(uniqueValidator);
UserSchema = UserSchema_1 = __decorate([
    inversify_1.injectable()
], UserSchema);
exports.UserSchema = UserSchema;
//# sourceMappingURL=UserSchema.js.map