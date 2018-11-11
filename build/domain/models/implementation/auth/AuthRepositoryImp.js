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
var _a, _b;
const RepositoryImp_1 = require("./RepositoryImp");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/dal/types");
const AuthDataMapper_1 = require("../../../infrastructure/dal/implementation/AuthDataMapper");
const AuthOrmRepository_1 = require("../../../infrastructure/dal/implementation/AuthOrmRepository");
let AuthRepositoryImp = class AuthRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper) {
        super(repository, dataMapper);
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.login(email, password);
            return this._dataMapper.toDomain(user);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.userType = 'individual';
            data.status = 'ongoing';
            const p = yield this._repository.createUser(data)
                .then((user) => {
                return Promise.resolve(user);
            }).catch((err) => {
                return Promise.reject(err);
            });
            return p;
        });
    }
};
AuthRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForAuthMongo)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMApperForAuth)),
    __metadata("design:paramtypes", [typeof (_a = typeof AuthOrmRepository_1.AuthOrmRepository !== "undefined" && AuthOrmRepository_1.AuthOrmRepository) === "function" ? _a : Object, typeof (_b = typeof AuthDataMapper_1.AuthDataMapper !== "undefined" && AuthDataMapper_1.AuthDataMapper) === "function" ? _b : Object])
], AuthRepositoryImp);
exports.AuthRepositoryImp = AuthRepositoryImp;
//# sourceMappingURL=AuthRepositoryImp.js.map