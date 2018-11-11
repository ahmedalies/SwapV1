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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("../../../../../node_modules/inversify");
const RepositoryImp_1 = require("../RepositoryImp");
const PointSystemSchema_1 = require("../../../../infrastructure/dal/entities/mongo/schemas/PointSystemSchema");
const PointsDataMapper_1 = require("../../../../infrastructure/dal/implementation/PointsDataMapper");
const types_1 = require("../../../../infrastructure/dal/types");
const ORMRepository_1 = require("../../../../infrastructure/dal/implementation/ORMRepository");
let PointsRepositoryImp = class PointsRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model) {
        super(repository, dataMapper, model);
    }
};
PointsRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForUserEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMApperForPoint)),
    __param(2, inversify_1.inject(types_1.TYPES.UserMongoSchema)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        PointsDataMapper_1.PointsDataMapper,
        PointSystemSchema_1.PointSystemSchema])
], PointsRepositoryImp);
exports.PointsRepositoryImp = PointsRepositoryImp;
//# sourceMappingURL=PointsRepositoryImp.js.map