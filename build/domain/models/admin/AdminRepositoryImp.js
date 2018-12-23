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
const RepositoryImp_1 = require("../base/RepositoryImp");
const AdminDataMapper_1 = require("../../../infrastructure/data_mapper/AdminDataMapper");
const AdminSchema_1 = require("../../../infrastructure/entities/mongo/schemas/AdminSchema");
const types_1 = require("../../../infrastructure/types");
const types_2 = require("../../types");
const InterestsRepositoryImp_1 = require("../interests/InterestsRepositoryImp");
const PrivilegeRepositoryImp_1 = require("../privileges/PrivilegeRepositoryImp");
const ORMRepository_1 = require("../../../infrastructure/implementation/ORMRepository");
const AdminPrivilegeRepositoryImp_1 = require("./admin_privilege/AdminPrivilegeRepositoryImp");
const DomainAdminPrivilege_1 = require("../../entities/DomainAdminPrivilege");
let AdminRepositoryImp = class AdminRepositoryImp extends RepositoryImp_1.RepositoryImp {
    constructor(repository, dataMapper, model, interests, privilege, adminPrivilege) {
        super(repository, dataMapper, ['admins']);
        this.repository = repository;
        this.dataMapper = dataMapper;
        this.model = model;
        this.interests = interests;
        this.privilege = privilege;
        this.adminPrivilege = adminPrivilege;
    }
    createAdmin(creatorId, admin) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                _super("createSHA1Hash").call(this, admin.username)
                    .then((hashKey) => {
                    _super("createSHA1Hash").call(this, admin.username + Date.now())
                        .then((accessToken) => {
                        this.hasPrivilege(creatorId, 'createAdmin')
                            .then((res) => {
                            _super("insert").call(this, ['_id', 'username', 'accessToken', 'password', 'loggedIn', 'online'], [hashKey, admin.username, accessToken, admin.password, '1', '1'])
                                .then((res) => {
                                console.log(res);
                                resolve(res);
                            }).catch((err) => {
                                console.log(err);
                                reject(err);
                            });
                        }).catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getAdmin(creatorId, id) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(creatorId, 'getAdmin')
                    .then((res) => {
                    _super("findOne").call(this, [], ['_id'], [id], 0)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    updateAdmin(creatorId, id, admin) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(creatorId, 'updateAdmin')
                    .then((res) => {
                    _super("update").call(this, ['username', 'accessToken', 'password', 'loggedIn', 'online'], [admin.username, admin.accessToken, admin.password, '1', '1'], ['_id'], [id])
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    removeAdmin(creatorId, id) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(creatorId, 'removeAdmin')
                    .then((res) => {
                    _super("remove").call(this, id)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getPrivilege(privilegeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.privilege.getPrivilege(privilegeName)
                    .then((res) => {
                    if (res)
                        resolve(res);
                    else
                        reject('privilege not found');
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    getInnerAdmin(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.repository.findOne(['admins.*', 'controlprivileges.f_name',
                    'controlPrivileges.id as controlPrivilegeId'], ['admins._id', 'admins.id', 'controlprivileges.id'], [adminId, 'adminprivileges.admin', 'adminprivileges.privilege'], 1, ['admins', 'adminprivileges', 'controlprivileges'])
                    .then((admin) => {
                    resolve(this.dataMapper.toDomain(admin));
                }).catch((err) => {
                    if (err === 'document not found') {
                        this.repository.findOne([], ['admins._id'], [adminId], 0, ['admins'])
                            .then((res) => {
                            resolve(this.dataMapper.toDomain(res));
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                });
            });
        });
    }
    hasPrivilege(adminId, privilegeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getPrivilege(privilegeName)
                    .then((res) => {
                    const privilegeId = res.id;
                    this.getInnerAdmin(adminId)
                        .then((res) => {
                        const privilegesArr = res.privileges;
                        let p_found = false;
                        if (privilegesArr) {
                            privilegesArr.forEach((item) => {
                                if (JSON.stringify(item.id) === JSON.stringify(privilegeId)) {
                                    p_found = true;
                                }
                            });
                            if (p_found) {
                                resolve(res);
                            }
                            else {
                                reject(res.username + ' does not have this privilege ' + privilegeName);
                            }
                        }
                        else {
                            reject(res.username + ' has no privileges yet');
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    addInterest(adminId, interest) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(adminId, 'addInterest')
                    .then((res) => {
                    interest.created_by.id = res.id;
                    this.interests.addInterest(interest)
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
    getInterest(adminId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(adminId, 'getInterest')
                    .then((res) => {
                    this.interests.getInterest(id)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    updateInterest(adminId, id, interest) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(adminId, 'updateInterest')
                    .then((res) => {
                    this.interests.updateInterest(id, interest)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    removeInterests(adminId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(adminId, 'removeInterests')
                    .then((res) => {
                    this.interests.deleteInterest(id)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    assingAdminPrivilege(creatorId, adminId, privilegeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.hasPrivilege(creatorId, 'assignAdminPrivilege')
                    .then((res) => {
                    this.privilege.getPrivilege(privilegeName)
                        .then((res) => {
                        let domainAdminPrivilege = new DomainAdminPrivilege_1.DomainAdminPrivilege();
                        domainAdminPrivilege.privilegeId = res.id;
                        this.getInnerAdmin(adminId)
                            .then((admin) => {
                            domainAdminPrivilege.adminId = admin.id;
                            this.adminPrivilege.getAdminPrivilege(domainAdminPrivilege.privilegeId, domainAdminPrivilege.adminId)
                                .then((res) => {
                                if (res) {
                                    reject('this admin ' + admin.username + ' already has this privilege ' + privilegeName);
                                }
                            }).catch((err) => {
                                if (err === 'document not found') {
                                    this.adminPrivilege.addAdminPrivilege(domainAdminPrivilege)
                                        .then((res) => {
                                        this.getInnerAdmin(admin._id)
                                            .then((a) => {
                                            resolve(a);
                                        }).catch((err) => {
                                            reject(err);
                                        });
                                    }).catch((err) => {
                                        console.log(err);
                                        reject(err);
                                    });
                                }
                                else {
                                    reject(err);
                                }
                            });
                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        });
    }
};
AdminRepositoryImp = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.ORMRepositoryForAdminEntity)),
    __param(1, inversify_1.inject(types_1.TYPES.EntityDataMapperForAdmin)),
    __param(2, inversify_1.inject(types_1.TYPES.AdminSchema)),
    __param(3, inversify_1.inject(types_2.TYPES.InterestsRepository)),
    __param(4, inversify_1.inject(types_2.TYPES.PrivilegeRepository)),
    __param(5, inversify_1.inject(types_2.TYPES.AdminPrivilegeRepository)),
    __metadata("design:paramtypes", [ORMRepository_1.ORMRepository,
        AdminDataMapper_1.AdminDataMapper,
        AdminSchema_1.AdminSchema,
        InterestsRepositoryImp_1.InterestsRepositoryImp,
        PrivilegeRepositoryImp_1.PrivilegeRepositoryImp,
        AdminPrivilegeRepositoryImp_1.AdminPrivilegeRepositoryImp])
], AdminRepositoryImp);
exports.AdminRepositoryImp = AdminRepositoryImp;
//# sourceMappingURL=AdminRepositoryImp.js.map