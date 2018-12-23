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
const ItemSchema_1 = require("../../../infrastructure/entities/mongo/schemas/ItemSchema");
const types_1 = require("../../../infrastructure/types");
const ItemDataMapper_1 = require("../../../infrastructure/data_mapper/ItemDataMapper");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
let UserItemRepositoryImp = class UserItemRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model) {
        super(repository, dataMapper, ['items']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
    }
    addItem(object) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            object.status = "available";
            object.oneWeekMilli = 604800000;
            return yield new Promise((resolve, reject) => {
                _super("createSHA1Hash").call(this, object.owner._id + Date.now())
                    .then((res) => {
                    _super("insert").call(this, ['_id', 'status', 'oneWeekMilli', 'owner', 'name', 'description', 'category'], [res, '1', object.oneWeekMilli.toString(), object.owner.id.toString(), object.name, object.description, object.category.id.toString()])
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    updateItem(itemId, object) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("update").call(this, ['status', 'oneWeekMilli', 'owner', 'name', 'description', 'category'], [object.status, object.oneWeekMilli.toString(), object.owner._id, object.name, object.description, object.category._id], ['_id'], [itemId])
                    .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getOneItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['items.*', 'itemstatus.state', 'users._id as ownerId', 'users.userType',
                    'usertype.type as ownerType'], ['items._id', 'items.owner', 'users.userType', 'items.status'], [itemId, 'users.id', 'usertype.id', 'itemstatus.id'], 1, ['items', 'users', 'usertype', 'itemstatus'])
                    .then((res) => {
                    //console.log(this.dataMapper.toDomain(res))
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        });
    }
    getOneItemByIdInt(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['items.*', 'itemstatus.state', 'users._id as ownerId', 'users.userType',
                    'usertype.type as ownerType'], ['items.id', 'items.owner', 'users.userType', 'items.status'], [itemId.toString(), 'users.id', 'usertype.id', 'itemstatus.id'], 1, ['items', 'users', 'usertype', 'itemstatus'])
                    .then((res) => {
                    //console.log(this.dataMapper.toDomain(res))
                    resolve(this.dataMapper.toDomain(res));
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        });
    }
    getUserItems(userId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("findAllByOnKey").call(this, { owner: userId });
        });
    }
    removeItem(itemId) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("remove").call(this, itemId);
        });
    }
};
UserItemRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForUserItemEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForItem)),
    __param(2, inversify_1.inject(types_1.TYPES.ItemSchema)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        ItemDataMapper_1.ItemDataMapper,
        ItemSchema_1.ItemSchema])
], UserItemRepositoryImp);
exports.UserItemRepositoryImp = UserItemRepositoryImp;
//# sourceMappingURL=UserItemRepositoryImp.js.map