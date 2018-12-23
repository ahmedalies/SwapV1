"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var SwapRequestSchema_1;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let SwapRequestSchema = SwapRequestSchema_1 = class SwapRequestSchema {
    getModel() {
        return mongoose_1.model('SwapRequest', SwapRequestSchema_1._schema);
    }
};
SwapRequestSchema._schema = new mongoose_1.Schema({
    /* ongoing - accepted - rejected - canceled- *system-sender* -*/
    /*
     * -ongoing -> swap request is sent to owner - no confirmation yet
     * -accepted -> swap request is accepted by owner
     * -rejected -> swap request is rejected by owner
     * -canceled-by-system -> all remain swap requests is canceled by system when needyUser's request to swap is accepted
     *              in one swap request
     * -canceled-by-sender -> cancel swap request due to sender cancel
     * */
    status: {
        type: String
    },
    sender_rate: {
        type: Number
    },
    receiver_rate: {
        type: Number
    },
    respond_at: {
        type: Number
    },
    milli24h: {
        type: Number
    },
    sender_item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    receiver_item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}).plugin(uniqueValidator);
SwapRequestSchema = SwapRequestSchema_1 = __decorate([
    inversify_1.injectable()
], SwapRequestSchema);
exports.SwapRequestSchema = SwapRequestSchema;
//# sourceMappingURL=SwapRequestSchema.js.map