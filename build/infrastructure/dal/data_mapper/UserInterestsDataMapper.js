"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomainUserInterests_1 = require("../../../domain/entities/DomainUserInterests");
const DALUserInterests_1 = require("../../entities/dal/DALUserInterests");
const inversify_1 = require("inversify");
let UserInterestsDataMapper = class UserInterestsDataMapper {
    toDAL(domainObject) {
        let userInterest = new DALUserInterests_1.DALUserInterests();
        userInterest._id = domainObject._id;
        userInterest.userId = domainObject.userId;
        userInterest.interests = domainObject.interests;
        return userInterest;
    }
    toDomain(dalObject) {
        let userInterest = new DomainUserInterests_1.DomainUserInterests();
        userInterest._id = dalObject._id;
        userInterest.userId = dalObject.userId;
        userInterest.interests = dalObject.interests;
        return userInterest;
    }
};
UserInterestsDataMapper = __decorate([
    inversify_1.injectable()
], UserInterestsDataMapper);
exports.UserInterestsDataMapper = UserInterestsDataMapper;
//# sourceMappingURL=UserInterestsDataMapper.js.map