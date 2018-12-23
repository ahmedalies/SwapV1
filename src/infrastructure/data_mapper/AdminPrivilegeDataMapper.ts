import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {injectable} from "inversify";
import {DomainAdminPrivilege} from "../../domain/entities/DomainAdminPrivilege";
import {DALAdminPrivilege} from "../entities/dal/DALAdminPrivilege";

@injectable()
export class AdminPrivilegeDataMapper implements EntityDataMapper<DomainAdminPrivilege, DALAdminPrivilege> {

    toDomain(dalObject: DALAdminPrivilege): DomainAdminPrivilege {
        let adminP = new DomainAdminPrivilege();
        adminP.id = dalObject.id;
        adminP.adminId = dalObject.admin;
        adminP.privilegeId = dalObject.privilege;
        adminP.createdAt = dalObject.created_at;
        return adminP;
    }

    toDAL(domainObject: DomainAdminPrivilege): DALAdminPrivilege {
        let adminP = new DALAdminPrivilege();
        adminP.admin = domainObject.adminId;
        adminP.privilege = domainObject.privilegeId;
        adminP.created_at = domainObject.createdAt;
        return adminP;
    }
}