"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomainItem_1 = require("../../domain/entities/DomainItem");
const DALItem_1 = require("../entities/dal/DALItem");
const inversify_1 = require("inversify");
const DomainInterest_1 = require("../../domain/entities/DomainInterest");
const DomainUser_1 = require("../../domain/entities/DomainUser");
let ItemDataMapper = class ItemDataMapper {
    toDomain(dalObject) {
        let item = new DomainItem_1.DomainItem();
        item.id = dalObject.id;
        item._id = dalObject._id;
        item.status = dalObject.status;
        item.name = dalObject.name;
        item.description = dalObject.description;
        item.oneWeekMilli = dalObject.oneWeekMilli;
        item.owner = new DomainUser_1.DomainUser();
        if (dalObject.uniqueAddedElement) {
            let ownerAr = dalObject.uniqueAddedElement['ownerId'];
            let ownerTypeAr = dalObject.uniqueAddedElement['ownerType'];
            let itemState = dalObject.uniqueAddedElement['state'];
            if (ownerAr) {
                item.owner._id = ownerAr[0];
            }
            if (ownerTypeAr) {
                item.owner.typeString = ownerTypeAr[0];
            }
            if (itemState) {
                item.statusString = itemState[0];
            }
        }
        item.i_urls = dalObject.i_urls;
        item.category = new DomainInterest_1.DomainInterest();
        item.category._id = dalObject.category;
        item.createdAt = dalObject.createdAt;
        return item;
    }
    toDAL(domainObject) {
        let item = new DALItem_1.DALItem();
        item._id = domainObject._id;
        item.status = domainObject.status;
        item.name = domainObject.name;
        item.description = domainObject.description;
        item.oneWeekMilli = domainObject.oneWeekMilli;
        item.owner = domainObject.owner._id;
        item.i_urls = domainObject.i_urls;
        item.category = domainObject.category._id;
        item.createdAt = domainObject.createdAt;
        return item;
    }
};
ItemDataMapper = __decorate([
    inversify_1.injectable()
], ItemDataMapper);
exports.ItemDataMapper = ItemDataMapper;
//# sourceMappingURL=ItemDataMapper.js.map