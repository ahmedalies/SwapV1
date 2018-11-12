import {inject, injectable} from "inversify";
import {RepositoryImp} from "../base/RepositoryImp";
import {DomainAdmin} from "../../entities/DomainAdmin";
import {DALAdmin} from "../../../infrastructure/entities/dal/DALAdmin";
import {AdminRepository} from "./AdminRepository";
import {MongoORMRepository} from "../../../infrastructure/dal/implementation/MongoORMRepository";
import {AdminDataMapper} from "../../../infrastructure/dal/data_mapper/AdminDataMapper";
import {AdminSchema} from "../../../infrastructure/entities/mongo/schemas/AdminSchema";
import {TYPES} from "../../../infrastructure/types";
import {TYPES as DOMAIN_TYPES} from "../../types";
import {InterestsRepositoryImp} from "../interests/InterestsRepositoryImp";
import {InterestsRepository} from "../interests/InterestsRepository";
import {Configuration} from "../../../configuration";
import {PrivilegeRepository} from "../privileges/PrivilegeRepository";
import {PrivilegeRepositoryImp} from "../privileges/PrivilegeRepositoryImp";
import {DomainInterest} from "../../entities/DomainInterest";
import {DomainControlPrivilege} from "../../entities/DomainControlPrivilege";

@injectable()
export class AdminRepositoryImp extends RepositoryImp<DomainAdmin, DALAdmin> implements AdminRepository {
    interests: InterestsRepository;
    privilege: PrivilegeRepository;
    repository: MongoORMRepository<DALAdmin>;
    model: AdminSchema;

    constructor(
        @inject(TYPES.ORMRepositoryForAdminEntity) repository: MongoORMRepository<DALAdmin>,
        @inject(TYPES.EntityDataMapperForAdmin) dataMapper: AdminDataMapper,
        @inject(TYPES.AdminSchema) model: AdminSchema,
        @inject(DOMAIN_TYPES.InterestsRepository) interests: InterestsRepositoryImp,
        @inject(DOMAIN_TYPES.PrivilegeRepository) privilege: PrivilegeRepositoryImp
    ){
        super(repository, dataMapper, model);
        this.interests = interests;
        this.privilege = privilege;
        this.repository = repository;
        this.model = model;
    }


    public async createAdmin(creatorId: string, admin: DomainAdmin): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin> ((resolve, reject) => {
            this.hasPrivilege(creatorId, 'createAdmin')
                .then((res) => {
                    super.insert(admin)
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

    public async getAdmin(creatorId: string, id: string): Promise<DomainAdmin> {
        let query = {_id: id};
        return await new Promise<DomainAdmin> ((resolve, reject) => {
            this.hasPrivilege(creatorId, 'getAdmin')
                .then((res) => {
                    super.findByOneKey(query)
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
                    super.update(id, admin)
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
            const query = {_id: adminId};
            this.repository.findByOneKey(query, this.model)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public async hasPrivilege(adminId, privilegeName: string): Promise<DomainAdmin> {
        return await new Promise<DomainAdmin>((resolve, reject) => {
            this.getPrivilege(privilegeName)
                .then((res) => {
                const privilegeId: string = res._id;
                    this.getInnerAdmin(adminId)
                        .then((res) => {
                            const privilegesArr = res.privileges;
                            let p_found: boolean = false;
                            if (privilegesArr){
                                privilegesArr.forEach((item: string) => {
                                    if (JSON.stringify(item) === JSON.stringify(privilegeId)) {
                                        p_found = true;
                                    }
                                });
                                if (p_found){
                                    resolve(res);
                                } else {
                                    reject('this admin does not have this privilege');
                                }
                            } else {
                                reject('this admin has no privileges')
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
                    this.interests.addInterest(interest)
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
}