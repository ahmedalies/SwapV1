"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DomainControlPrivilege_1 = require("../../domain/entities/DomainControlPrivilege");
const DALControlPrivilege_1 = require("../entities/dal/DALControlPrivilege");
const inversify_1 = require("inversify");
let PrivilegeDataMapper = class PrivilegeDataMapper {
    toDomain(dalObject) {
        let privilege = new DomainControlPrivilege_1.DomainControlPrivilege();
        privilege.id = dalObject.id;
        privilege.name = dalObject.f_name;
        privilege.created_at = dalObject.created_at;
        return privilege;
    }
    toDAL(domainObject) {
        let privilege = new DALControlPrivilege_1.DALControlPrivilege();
        privilege.f_name = domainObject.name;
        privilege.created_at = domainObject.created_at;
        return privilege;
    }
};
PrivilegeDataMapper = __decorate([
    inversify_1.injectable()
], PrivilegeDataMapper);
exports.PrivilegeDataMapper = PrivilegeDataMapper;
//# sourceMappingURL=PrivilegeDataMapper.js.map