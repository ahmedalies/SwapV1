"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const DomainSwapRequest_1 = require("../../domain/entities/DomainSwapRequest");
const DALSwapRequest_1 = require("../entities/dal/DALSwapRequest");
const DomainItem_1 = require("../../domain/entities/DomainItem");
let SwapRequestMapper = class SwapRequestMapper {
    toDomain(dalObject) {
        let request = new DomainSwapRequest_1.DomainSwapRequest();
        request._id = dalObject._id;
        request.senderRate = dalObject.sender_rate;
        request.receiverRate = dalObject.receiver_rate;
        request.respondAt = dalObject.respond_at;
        request.status = dalObject.status;
        request.milliSecondAfter24Hours = dalObject.milli24h;
        request.senderItem = new DomainItem_1.DomainItem();
        request.senderItem.id = dalObject.sender_item;
        request.receiverItem = new DomainItem_1.DomainItem();
        request.receiverItem.id = dalObject.receiver_item;
        request.createdAt = dalObject.created_at;
        request.swapStatusString = dalObject.swapStatusString;
        return request;
    }
    toDAL(domainObject) {
        let request = new DALSwapRequest_1.DALSwapRequest();
        request._id = domainObject._id;
        request.sender_rate = domainObject.senderRate;
        request.receiver_rate = domainObject.receiverRate;
        request.respond_at = domainObject.respondAt;
        request.status = domainObject.status;
        request.milli24h = domainObject.milliSecondAfter24Hours;
        request.sender_item = domainObject.senderItem.id;
        request.receiver_item = domainObject.receiverItem.id;
        request.created_at = domainObject.createdAt;
        return request;
    }
};
SwapRequestMapper = __decorate([
    inversify_1.injectable()
], SwapRequestMapper);
exports.SwapRequestMapper = SwapRequestMapper;
//# sourceMappingURL=SwapRequestMapper.js.map