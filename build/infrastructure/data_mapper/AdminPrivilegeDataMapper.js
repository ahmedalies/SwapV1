"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const DomainAdminPrivilege_1 = require("../../domain/entities/DomainAdminPrivilege");
const DALAdminPrivilege_1 = require("../entities/dal/DALAdminPrivilege");
let AdminPrivilegeDataMapper = class AdminPrivilegeDataMapper {
    toDomain(dalObject) {
        let adminP = new DomainAdminPrivilege_1.DomainAdminPrivilege();
        adminP.id = dalObject.id;
        adminP.adminId = dalObject.admin;
        adminP.privilegeId = dalObject.privilege;
        adminP.createdAt = dalObject.created_at;
        return adminP;
    }
    toDAL(domainObject) {
        let adminP = new DALAdminPrivilege_1.DALAdminPrivilege();
        adminP.admin = domainObject.adminId;
        adminP.privilege = domainObject.privilegeId;
        adminP.created_at = domainObject.createdAt;
        return adminP;
    }
};
AdminPrivilegeDataMapper = __decorate([
    inversify_1.injectable()
], AdminPrivilegeDataMapper);
exports.AdminPrivilegeDataMapper = AdminPrivilegeDataMapper;
//# sourceMappingURL=AdminPrivilegeDataMapper.js.map