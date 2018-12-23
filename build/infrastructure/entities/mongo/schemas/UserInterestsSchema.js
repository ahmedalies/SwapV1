"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserInterestSchema_1;
const inversify_1 = require("inversify");
const uniqueValidator = require("mongoose-unique-validator");
const mongoose_1 = require("mongoose");
let UserInterestSchema = UserInterestSchema_1 = class UserInterestSchema {
    getModel() {
        return mongoose_1.model('UserInterest', UserInterestSchema_1._schema);
    }
};
UserInterestSchema._schema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    interests: [{
            interest: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Interest' },
            created_at: { type: Date, default: Date.now() }
        }],
}).plugin(uniqueValidator);
UserInterestSchema = UserInterestSchema_1 = __decorate([
    inversify_1.injectable()
], UserInterestSchema);
exports.UserInterestSchema = UserInterestSchema;
//# sourceMappingURL=UserInterestsSchema.js.map