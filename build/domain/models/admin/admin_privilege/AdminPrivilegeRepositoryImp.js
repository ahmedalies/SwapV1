"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const RepositoryImp_1 = require("../../base/RepositoryImp");
const types_1 = require("../../../../infrastructure/types");
const ORMRepository_1 = require("../../../../infrastructure/implementation/ORMRepository");
const AdminPrivilegeDataMapper_1 = require("../../../../infrastructure/data_mapper/AdminPrivilegeDataMapper");
let AdminPrivilegeRepositoryImp = class AdminPrivilegeRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper) {
        super(repository, dataMapper, ['adminprivileges']);
        this.repository = repository;
        this.dataMapper = dataMapper;
    }
    addAdminPrivilege(adminP) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("insert").call(this, ['admin', 'privilege'], [adminP.adminId.toString(), adminP.privilegeId.toString()]);
        });
    }
    getAdminPrivileges(adminId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("findMany").call(this, [], ['admin'], [adminId], 0);
        });
    }
    getAdminPrivilege(privilegeId, adminId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("findOne").call(this, [], ['admin', 'privilege'], [adminId.toString(), privilegeId.toString()], 0);
        });
    }
};
AdminPrivilegeRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForAdminPrivilegeEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForAdminPrivilege)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        AdminPrivilegeDataMapper_1.AdminPrivilegeDataMapper])
], AdminPrivilegeRepositoryImp);
exports.AdminPrivilegeRepositoryImp = AdminPrivilegeRepositoryImp;
//# sourceMappingURL=AdminPrivilegeRepositoryImp.js.map