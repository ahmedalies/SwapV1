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
const RepositoryImp_1 = require("../base/RepositoryImp");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/types");
const PrivilegeDataMapper_1 = require("../../../infrastructure/data_mapper/PrivilegeDataMapper");
const ControlPrivilegeSchema_1 = require("../../../infrastructure/entities/mongo/schemas/ControlPrivilegeSchema");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
let PrivilegeRepositoryImp = class PrivilegeRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model) {
        super(repository, dataMapper, ['controlprivileges']);
    }
    getPrivilege(p_name) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("findOne").call(this, [], ['f_name'], [p_name], 0)
                    .then((res) => {
                    if (res)
                        resolve(res);
                    else
                        reject('not found');
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
};
PrivilegeRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForPrivilegeEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForPrivilege)),
    __param(2, inversify_1.inject(types_1.TYPES.PrivilegeSchema)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        PrivilegeDataMapper_1.PrivilegeDataMapper,
        ControlPrivilegeSchema_1.ControlPrivilegeSchema])
], PrivilegeRepositoryImp);
exports.PrivilegeRepositoryImp = PrivilegeRepositoryImp;
//# sourceMappingURL=PrivilegeRepositoryImp.js.map