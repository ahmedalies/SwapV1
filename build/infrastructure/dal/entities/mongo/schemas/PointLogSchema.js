"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PointLogSchema_1;
const mongoose_1 = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const inversify_1 = require("inversify");
let PointLogSchema = PointLogSchema_1 = class PointLogSchema {
    ;
    getModel() {
        return mongoose_1.model('PointLog', PointLogSchema_1._schema);
    }
};
PointLogSchema._schema = new mongoose_1.Schema({
    u_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sub_p_ref: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'SubPointSystem'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}).plugin(uniqueValidator);
PointLogSchema = PointLogSchema_1 = __decorate([
    inversify_1.injectable()
], PointLogSchema);
exports.PointLogSchema = PointLogSchema;
//# sourceMappingURL=PointLogSchema.js.map