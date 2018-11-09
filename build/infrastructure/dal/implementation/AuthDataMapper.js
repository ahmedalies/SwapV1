"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainUser_1 = require("../../../domain/entities/DomainUser");
const MongoUser_1 = require("../entities/mongo/MongoUser");
class AuthDataMapper {
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
        return domainUser;
    }
    toDAL(domainUser) {
        let mongoUser = new MongoUser_1.MongoUser();
        mongoUser._id = domainUser._id;
        mongoUser.avatar = domainUser.avatar;
        mongoUser.created_at = domainUser.created_at;
        mongoUser.email = domainUser.email;
        mongoUser.name = domainUser.name;
        mongoUser.password = domainUser.password;
        mongoUser.phone = domainUser.phone;
        mongoUser.status = domainUser.status;
        mongoUser.userType = domainUser.userType;
        return mongoUser;
    }
}
exports.AuthDataMapper = AuthDataMapper;
//# sourceMappingURL=AuthDataMapper.js.map