import {Repository} from "../base/Repository";
import {DomainControlPrivilege} from "../../entities/DomainControlPrivilege";

export interface PrivilegeRepository extends Repository<DomainControlPrivilege> {
    getPrivilege(p_name: string): Promise<DomainControlPrivilege>;
}