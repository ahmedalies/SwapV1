"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const DomainAdmin_1 = require("../../domain/entities/DomainAdmin");
const DALAdmin_1 = require("../entities/dal/DALAdmin");
const DomainControlPrivilege_1 = require("../../domain/entities/DomainControlPrivilege");
let AdminDataMapper = class AdminDataMapper {
    toDomain(dalObject) {
        let admin = new DomainAdmin_1.DomainAdmin();
        admin.id = dalObject.id;
        admin._id = dalObject._id;
        admin.username = dalObject.username;
        admin.isLoggedIn = dalObject.isLoggedIn;
        admin.online = dalObject.online;
        admin.password = dalObject.password;
        //admin.privileges = dalObject.privileges;
        if (dalObject.uniqueAddedElement) {
            admin.privileges = [];
            let counter = 0;
            let controlPrivilegeIds = dalObject.uniqueAddedElement['controlPrivilegeId'];
            let controlPrivilegeNames = dalObject.uniqueAddedElement['f_name'];
            controlPrivilegeIds.forEach((x) => {
                let controlPrivilege = new DomainControlPrivilege_1.DomainControlPrivilege();
                controlPrivilege.id = x;
                controlPrivilege.name = controlPrivilegeNames[counter];
                admin.privileges.push(controlPrivilege);
                counter++;
            });
        }
        admin.accessToken = dalObject.accessToken;
        admin.createdAt = dalObject.createdAt;
        return admin;
    }
    toDAL(domainObject) {
        let admin = new DALAdmin_1.DALAdmin();
        admin._id = domainObject._id;
        admin.username = domainObject.username;
        admin.isLoggedIn = domainObject.isLoggedIn;
        admin.online = domainObject.online;
        admin.password = domainObject.password;
        //admin.privileges = domainObject.privileges;
        admin.accessToken = domainObject.accessToken;
        admin.createdAt = domainObject.createdAt;
        return admin;
    }
};
AdminDataMapper = __decorate([
    inversify_1.injectable()
], AdminDataMapper);
exports.AdminDataMapper = AdminDataMapper;
//# sourceMappingURL=AdminDataMapper.js.map