"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AdminSchema_1;
const mongoose_1 = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const inversify_1 = require("inversify");
let AdminSchema = AdminSchema_1 = class AdminSchema {
    getModel() {
        return mongoose_1.model('Admin', AdminSchema_1._schema);
    }
};
AdminSchema._schema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    accessToken: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    password: {
        type: String,
        required: true
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    },
    privileges: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'ControlPrivilege'
        }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
}).plugin(uniqueValidator);
AdminSchema = AdminSchema_1 = __decorate([
    inversify_1.injectable()
], AdminSchema);
exports.AdminSchema = AdminSchema;
//# sourceMappingURL=AdminSchema.js.map