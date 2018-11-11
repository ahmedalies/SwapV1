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
const ORMRepository_1 = require("../../../infrastructure/dal/implementation/ORMRepository");
const inversify_1 = require("inversify");
let RepositoryImp = class RepositoryImp {
    constructor(repository, dataMapper, model) {
        this._repository = repository;
        this._dataMapper = dataMapper;
        this._model = model;
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = yield this._repository.insert(this._dataMapper.toDAL(data), this._model)
                .then((user) => {
                return Promise.resolve(this._dataMapper.toDomain(user));
            }).catch((err) => {
                return Promise.reject(err);
            });
            return p;
        });
    }
    findByTwoKeys(k1, k2, v1, v2) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = yield this._repository.findByTwoKeys(k1, k2, v1, v2, this._model)
                .then((user) => {
                return Promise.resolve(this._dataMapper.toDomain(user));
            }).catch((err) => {
                return Promise.reject(err);
            });
            return p;
        });
    }
};
RepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.unmanaged()),
    __param(1, inversify_1.unmanaged()),
    __param(2, inversify_1.unmanaged()),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository, Object, Object])
], RepositoryImp);
exports.RepositoryImp = RepositoryImp;
//# sourceMappingURL=RepositoryImp.js.map