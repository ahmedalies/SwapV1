import {inject, injectable} from "inversify";
import * as Busboy from "busboy";
import * as fs from 'fs'
import {RepositoryImp} from "../base/RepositoryImp";
import {DomainAdmin} from "../../entities/DomainAdmin";
import {DALAdmin} from "../../../infrastructure/entities/dal/DALAdmin";
import {AdminRepository} from "./AdminRepository";
import {MongoORMRepository} from "../../../infrastructure/implementation/MongoORMRepository";
import {AdminDataMapper} from "../../../infrastructure/data_mapper/AdminDataMapper";
import {AdminSchema} from "../../../infrastructure/entities/mongo/schemas/AdminSchema";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from "../../types";
import {InterestsRepositoryImp} from "../interests/InterestsRepositoryImp";
import {InterestsRepository} from "../interests/InterestsRepository";
import {PrivilegeRepository} from "../privileges/PrivilegeRepository";
import {PrivilegeRepositoryImp} from "../privileges/PrivilegeRepositoryImp";
import {DomainInterest} from "../../entities/DomainInterest";
import {DomainControlPrivilege} from "../../entities/DomainControlPrivilege";
import {MysqlORMRepository} from "../../../infrastructure/implementation/MysqlORMRepository";
import {ORMRepository} from "../../../infrastructure/implementation/ORMRepository";
import {AdminPrivilegeRepositoryImp} from "./admin_privilege/AdminPrivilegeRepositoryImp";
import { promises } from "fs";
import { resolve } from "url";
import { DomainAdminPrivilege } from "../../entities/DomainAdminPrivilege";

@injectable()
export class AdminRepositoryImp extends RepositoryImp<DomainAdmin, DALAdmin> implements AdminRepository {

    constructor(
        @inject(TYPES.ORMRepositoryForAdminEntity) private repository: ORMRepository<DALAdmin>,
        @inject(TYPES.EntityDataMapperForAdmin) private dataMapper: AdminDataMapper,
        @inject(TYPES.AdminSchema) private model: AdminSchema,
        @inject(DOMAIN_TYPES.InterestsRepository) private interests: InterestsRepositoryImp,
        @inject(DOMAIN_TYPES.PrivilegeRepository) private privilege: PrivilegeRepositoryImp,
        @inject(DOMAIN_TYPES.AdminPrivilegeRepository) private adminPrivilege: AdminPrivilegeRepositoryImp
    ){
        super(repository, dataMapper, ['admins']);
    }


    public async createAdmin(creatorId: string, admin: DomainAdmin): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin> ((resolve, reject) => {
            super.createSHA1Hash(admin.username)
                .then((hashKey) => {
                super.createSHA1Hash(admin.username + Date.now())
                    .then((accessToken) => {
                        this.hasPrivilege(creatorId, 'createAdmin')
                            .then((res) => {
                                super.insert(['_id', 'username' ,'accessToken', 'password', 'loggedIn', 'online'],
                                    [hashKey, admin.username, accessToken, admin.password, '1', '1'])
                                    .then((res) => {
                                        console.log(res);
                                        resolve(res);
                                    }).catch((err) => {
                                        console.log(err)
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
    }

    public async getAdmin(creatorId: string, id: string): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin> ((resolve, reject) => {
            this.hasPrivilege(creatorId, 'getAdmin')
                .then((res) => {
                    super.findOne([], ['_id'], [id], 0)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async updateAdmin(creatorId: string, id: string, admin: DomainAdmin): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin> ((resolve, reject) => {
            this.hasPrivilege(creatorId, 'updateAdmin')
                .then((res) => {
                    super.update(['username' ,'accessToken', 'password', 'loggedIn', 'online'],
                        [admin.username, admin.accessToken, admin.password, '1', '1'],
                        ['_id'], [id])
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async removeAdmin(creatorId: string, id: string): Promise<boolean> {
        return await new Promise<boolean> ((resolve, reject) => {
            this.hasPrivilege(creatorId, 'removeAdmin')
                .then((res) => {
                    super.remove(id)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                    });
                }).catch((err) => {
                    reject(err);
            });
        });
    }

    public async getPrivilege(privilegeName: string): Promise<DomainControlPrivilege> {
        return await new Promise<DomainControlPrivilege>((resolve, reject) => {
            this.privilege.getPrivilege(privilegeName)
                .then((res) => {
                    if (res)
                        resolve(res);
                    else
                        reject('privilege not found')
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    private async getInnerAdmin(adminId: string): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin> ((resolve, reject) => {
            this.repository.findOne(['admins.*', 'controlprivileges.f_name',
             'controlPrivileges.id as controlPrivilegeId'], 
             ['admins._id', 'admins.id', 'controlprivileges.id'],
              [adminId, 'adminprivileges.admin', 'adminprivileges.privilege'], 1,
             ['admins', 'adminprivileges', 'controlprivileges'])
                .then((admin) => {
                    resolve(this.dataMapper.toDomain(admin))
                }).catch((err) => {
                    if (err === 'document not found'){
                        this.repository.findOne([], ['admins._id'], [adminId], 0, ['admins'])
                        .then((res) => {
                            resolve(this.dataMapper.toDomain(res));
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                });
        });
    }

    public async hasPrivilege(adminId, privilegeName: string): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin>((resolve, reject) => {
            this.getPrivilege(privilegeName)
                .then((res) => {
                    const privilegeId = res.id;
                    this.getInnerAdmin(adminId)
                        .then((res) => {
                            const privilegesArr = res.privileges;
                            let p_found: boolean = false;
                            if (privilegesArr){
                                privilegesArr.forEach((item: DomainControlPrivilege) => {
                                    if (JSON.stringify(item.id) === JSON.stringify(privilegeId)) {
                                        p_found = true;
                                    }
                                });
                                if (p_found){
                                    resolve(res);
                                } else {
                                    reject(res.username + ' does not have this privilege ' + privilegeName);
                                }
                            } else {
                                reject(res.username + ' has no privileges yet')
                            }
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async addInterest(adminId: string, interest: DomainInterest): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
            this.hasPrivilege(adminId, 'addInterest')
                .then((res) => {
                    interest.created_by.id = res.id;
                    this.interests.addInterest(interest)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            console.log(err)
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async getInterest(adminId: string, id: string): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
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
    }

    public async updateInterest(adminId: string, id: string, interest: DomainInterest): Promise<DomainInterest> {
        return await new Promise<DomainInterest>((resolve, reject) => {
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
    }

    public async removeInterests(adminId: string, id: string): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
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
    }

    public async assingAdminPrivilege(creatorId: string, adminId: string, privilegeName: string): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin>((resolve, reject) => {
            this.hasPrivilege(creatorId, 'assignAdminPrivilege')
            .then((res) => {
                this.privilege.getPrivilege(privilegeName)
                .then((res) => {
                    let domainAdminPrivilege = new DomainAdminPrivilege();
                    domainAdminPrivilege.privilegeId = res.id; 
                    this.getInnerAdmin(adminId)
                    .then((admin) => {
                        domainAdminPrivilege.adminId = admin.id;   
                        this.adminPrivilege.getAdminPrivilege(domainAdminPrivilege.privilegeId, domainAdminPrivilege.adminId)
                        .then((res) => {
                            if (res) {
                                reject('this admin ' + admin.username  + ' already has this privilege ' + privilegeName)
                            }
                        }).catch((err) => {
                            if (err === 'document not found'){
                                this.adminPrivilege.addAdminPrivilege(domainAdminPrivilege)
                                .then((res) => {
                                    this.getInnerAdmin(admin._id)
                                    .then((a) => {
                                        resolve(a);
                                    }).catch((err) => {
                                        reject(err);
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                    reject(err);
                                });
                            } else {
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
    }
}