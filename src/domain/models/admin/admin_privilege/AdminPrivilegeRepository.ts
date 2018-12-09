import {injectable} from "inversify";
import {Repository} from "../../base/Repository";
import {DomainAdminPrivilege} from "../../../entities/DomainAdminPrivilege";

@injectable()
export interface AdminPrivilege extends Repository<DomainAdminPrivilege> {
    addAdminPrivilege(adminP: DomainAdminPrivilege): Promise<DomainAdminPrivilege>;
    getAdminPrivilege(privilegeId: number, adminId: number): Promise<DomainAdminPrivilege>;
}