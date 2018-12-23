import {Repository} from "../base/Repository";
import {DomainAdmin} from "../../entities/DomainAdmin";
import {InterestsRepository} from "../interests/InterestsRepository";
import {PrivilegeRepository} from "../privileges/PrivilegeRepository";
import {DomainInterest} from "../../entities/DomainInterest";
import {DomainControlPrivilege} from "../../entities/DomainControlPrivilege";

export interface AdminRepository extends Repository<DomainAdmin> {

    //privilege functions
    hasPrivilege(adminId, privilege: string): Promise<DomainAdmin>;
    getPrivilege(privilegeName: string): Promise<DomainControlPrivilege>;
    assingAdminPrivilege(creatorId: string, adminId: string, privilegeName: string): Promise<DomainAdmin>

    //admin functions
    createAdmin(creatorId: string, admin: DomainAdmin): Promise<DomainAdmin>;
    getAdmin(creatorId: string, id: string): Promise<DomainAdmin>;
    updateAdmin(creatorId: string, id: string, admin: DomainAdmin): Promise<DomainAdmin>;
    removeAdmin(creatorId: string, id: string): Promise<boolean>;

    //interests functions
    addInterest(adminId: string, interest: DomainInterest): Promise<DomainInterest>;
    getInterest(adminId: string, id: string): Promise<DomainInterest>;
    updateInterest(adminId: string, id: string, interest: DomainInterest): Promise<DomainInterest>;
    removeInterests(adminId: string, id: string): Promise<boolean>;
}