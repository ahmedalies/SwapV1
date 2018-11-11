"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var InterestSchema_1;
const mongoose_1 = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const inversify_1 = require("inversify");
let InterestSchema = InterestSchema_1 = class InterestSchema {
    getModel() {
        return mongoose_1.model('Interest', InterestSchema_1._schema);
    }
};
InterestSchema._schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    I_url: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}).plugin(uniqueValidator);
InterestSchema = InterestSchema_1 = __decorate([
    inversify_1.injectable()
], InterestSchema);
exports.InterestSchema = InterestSchema;
//# sourceMappingURL=InterestSchema.js.map