import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainControlPrivilege} from "../../domain/entities/DomainControlPrivilege";
import {DALControlPrivilege} from "../entities/dal/DALControlPrivilege";
import {injectable} from "inversify";

@injectable()
export class PrivilegeDataMapper implements EntityDataMapper<DomainControlPrivilege, DALControlPrivilege> {

    toDomain(dalObject: DALControlPrivilege): DomainControlPrivilege {
        let privilege = new DomainControlPrivilege();
        privilege._id = dalObject._id;
        privilege.name = dalObject.f_name;
        privilege.created_at = dalObject.created_at;
        return privilege;
    }

    toDAL(domainObject: DomainControlPrivilege): DALControlPrivilege {
        let privilege = new DALControlPrivilege();
        privilege.f_name = domainObject.name;
        privilege._id = domainObject._id;
        privilege.created_at = domainObject.created_at;
        return privilege;
    }
}