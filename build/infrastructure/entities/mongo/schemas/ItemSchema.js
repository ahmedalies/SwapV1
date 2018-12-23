"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ItemSchema_1;
const mongoose_1 = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const inversify_1 = require("inversify");
let ItemSchema = ItemSchema_1 = class ItemSchema {
    getModel() {
        return mongoose_1.model('Item', ItemSchema_1._schema);
    }
};
ItemSchema._schema = new mongoose_1.Schema({
    /*available - **not-available** - blocked - in-review - rejected - in-swapping - swapped*/
    /*
     * -available -> indicates user_item available for swapping
     * -in-review -> user_item goes in-review on **admin due to report or 1 week policy or**
     *      republish
     * -blocked -> user_item blocked by admin due report or 1 week period
     *       without requests or not accepting request
     *
     *       1- blocked for report
     *       2- blocked for 1 week policy without requests
     *       3- blocked for 1 week policy without accepting requests
     * -rejected -> rejected by admin after in-review state
     * -in-swapping -> after accepting request within 24 hours
     * -swapped -> user_item has been swapped
     * -processing -> user_item is in processing mode at that time
     * */
    status: {
        type: String,
        default: 'available'
    },
    oneWeekMilli: {
        type: Number,
        default: 604800000,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    i_urls: [{
            url: String
        }],
    createdAt: {
        type: Number,
    }
}).plugin(uniqueValidator);
ItemSchema = ItemSchema_1 = __decorate([
    inversify_1.injectable()
], ItemSchema);
exports.ItemSchema = ItemSchema;
//# sourceMappingURL=ItemSchema.js.map