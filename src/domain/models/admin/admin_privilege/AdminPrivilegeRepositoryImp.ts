import {inject, injectable} from "inversify";
import {RepositoryImp} from "../../base/RepositoryImp";
import {DomainAdminPrivilege} from "../../../entities/DomainAdminPrivilege";
import {DALAdminPrivilege} from "../../../../infrastructure/entities/dal/DALAdminPrivilege";
import {AdminPrivilege} from "./AdminPrivilege";
import {TYPES} from "../../../../infrastructure/types";
import {ORMRepository} from "../../../../infrastructure/implementation/ORMRepository";
import {AdminPrivilegeDataMapper} from "../../../../infrastructure/data_mapper/AdminPrivilegeDataMapper";

@injectable()
export class AdminPrivilegeImp extends RepositoryImp<DomainAdminPrivilege, DALAdminPrivilege> implements AdminPrivilege {

    constructor(
        @inject(TYPES.ORMRepositoryForAdminPrivilegeEntity) private repository: ORMRepository<DALAdminPrivilege>,
        @inject(TYPES.EntityDataMapperForAdminPrivilege) private dataMapper: AdminPrivilegeDataMapper
    ){
        super(repository, dataMapper, 'adminprivileges');
    }
    public async addAdminPrivilege(adminP: DomainAdminPrivilege): Promise<DomainAdminPrivilege> {
        return await super.insert(['admin', 'privilege'], [adminP.adminId, adminP.privilegeId]);
    }

    public async getAdminPrivilege(privilegeId: number, adminId: number): Promise<DomainAdminPrivilege> {
        return await super.findOne([], ['admin', 'privilege'], [adminId, privilegeId]);
    }
}