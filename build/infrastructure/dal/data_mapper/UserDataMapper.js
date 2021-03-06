"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomainUser_1 = require("../../../domain/entities/DomainUser");
const DALUser_1 = require("../../entities/dal/DALUser");
const inversify_1 = require("inversify");
let UserDataMapper = class UserDataMapper {
    toDomain(mongoUser) {
        let domainUser = new DomainUser_1.DomainUser();
        domainUser._id = mongoUser._id;
        domainUser.avatar = mongoUser.avatar;
        domainUser.created_at = mongoUser.created_at;
        domainUser.email = mongoUser.email;
        domainUser.name = mongoUser.name;
        domainUser.password = mongoUser.password;
        domainUser.phone = mongoUser.phone;
        domainUser.status = mongoUser.status;
        domainUser.userType = mongoUser.userType;
        domainUser.accessToken = mongoUser.accessToken;
        return domainUser;
    }
    toDAL(domainUser) {
        let mongoUser = new DALUser_1.DALUser();
        mongoUser.id = domainUser._id;
        mongoUser.avatar = domainUser.avatar;
        mongoUser.created_at = domainUser.created_at;
        mongoUser.email = domainUser.email;
        mongoUser.name = domainUser.name;
        mongoUser.password = domainUser.password;
        mongoUser.phone = domainUser.phone;
        mongoUser.status = domainUser.status;
        mongoUser.userType = domainUser.userType;
        mongoUser.accessToken = domainUser.accessToken;
        return mongoUser;
    }
};
UserDataMapper = __decorate([
    inversify_1.injectable()
], UserDataMapper);
exports.UserDataMapper = UserDataMapper;
//# sourceMappingURL=UserDataMapper.js.map