
import {Repository} from "../../base/Repository";
import {DomainAdminPrivilege} from "../../../entities/DomainAdminPrivilege";

export interface AdminPrivilegeRepository extends Repository<DomainAdminPrivilege> {
    addAdminPrivilege(adminP: DomainAdminPrivilege): Promise<DomainAdminPrivilege>;
    getAdminPrivileges(adminId: string): Promise<DomainAdminPrivilege[]>
    getAdminPrivilege(privilegeId: number, adminId: number): Promise<DomainAdminPrivilege>;
}