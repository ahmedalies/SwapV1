"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomainUser_1 = require("../../domain/entities/DomainUser");
const DALUser_1 = require("../entities/dal/DALUser");
const inversify_1 = require("inversify");
let UserDataMapper = class UserDataMapper {
    toDomain(dalUser) {
        let domainUser = new DomainUser_1.DomainUser();
        domainUser.id = dalUser.id;
        domainUser._id = dalUser._id;
        domainUser.avatar = dalUser.avatar;
        domainUser.created_at = dalUser.created_at;
        domainUser.email = dalUser.email;
        domainUser.name = dalUser.username;
        domainUser.password = dalUser.password;
        domainUser.phone = dalUser.phone;
        domainUser.gender = dalUser.gender;
        domainUser.status = dalUser.status;
        domainUser.userType = dalUser.userType;
        domainUser.accessToken = dalUser.accessToken;
        domainUser.statusString = dalUser.statusString;
        domainUser.typeString = dalUser.typeString;
        domainUser.lang = dalUser.lang;
        domainUser.isValidToken = Date.now() < dalUser.validAccessTokenTill;
        return domainUser;
    }
    toDAL(domainUser) {
        let dalUser = new DALUser_1.DALUser();
        dalUser.id = domainUser.id;
        dalUser._id = domainUser._id;
        dalUser.avatar = domainUser.avatar;
        dalUser.created_at = domainUser.created_at;
        dalUser.email = domainUser.email;
        dalUser.username = domainUser.name;
        dalUser.password = domainUser.password;
        dalUser.phone = domainUser.phone;
        dalUser.gender = domainUser.gender;
        dalUser.status = domainUser.status;
        dalUser.userType = domainUser.userType;
        dalUser.accessToken = domainUser.accessToken;
        dalUser.validAccessTokenTill = Date.now() + 2592000000;
        return dalUser;
    }
};
UserDataMapper = __decorate([
    inversify_1.injectable()
], UserDataMapper);
exports.UserDataMapper = UserDataMapper;
//# sourceMappingURL=UserDataMapper.js.map