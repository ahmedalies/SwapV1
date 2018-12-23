"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomainInterest_1 = require("../../../domain/entities/DomainInterest");
const DALInterest_1 = require("../../entities/dal/DALInterest");
const inversify_1 = require("inversify");
let InterestDataMapper = class InterestDataMapper {
    toDAL(domainObject) {
        let interest = new DALInterest_1.DALInterest();
        interest._id = domainObject._id;
        interest.created_at = domainObject.created_at;
        interest.image_url = domainObject.image_url;
        interest.name = domainObject.name;
        interest.created_by = domainObject.created_by;
        return interest;
    }
    toDomain(dalObject) {
        let interest = new DomainInterest_1.DomainInterest();
        interest.name = dalObject.name;
        interest.image_url = dalObject.image_url;
        interest.created_at = dalObject.created_at;
        interest._id = dalObject._id;
        interest.created_by = dalObject.created_by;
        return interest;
    }
};
InterestDataMapper = __decorate([
    inversify_1.injectable()
], InterestDataMapper);
exports.InterestDataMapper = InterestDataMapper;
//# sourceMappingURL=InterestDataMapper.js.map