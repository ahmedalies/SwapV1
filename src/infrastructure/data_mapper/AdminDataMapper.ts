import {injectable} from "inversify";
import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainAdmin} from "../../domain/entities/DomainAdmin";
import {DALAdmin} from "../entities/dal/DALAdmin";
import { DomainControlPrivilege } from "../../domain/entities/DomainControlPrivilege";

@injectable()
export class AdminDataMapper implements EntityDataMapper<DomainAdmin, DALAdmin> {

    toDomain(dalObject: DALAdmin): DomainAdmin {
        let admin = new DomainAdmin();
        admin.id = dalObject.id;
        admin._id = dalObject._id;
        admin.username = dalObject.username;
        admin.isLoggedIn = dalObject.isLoggedIn;
        admin.online = dalObject.online;
        admin.password = dalObject.password;
        //admin.privileges = dalObject.privileges;

        if (dalObject.uniqueAddedElement) {
            admin.privileges = [];
            let counter = 0;
            let controlPrivilegeIds = dalObject.uniqueAddedElement['controlPrivilegeId'];
            let controlPrivilegeNames = dalObject.uniqueAddedElement['f_name'];
            
            controlPrivilegeIds.forEach((x) => {
                let controlPrivilege = new DomainControlPrivilege()
                controlPrivilege.id = x;
                controlPrivilege.name = controlPrivilegeNames[counter];
                admin.privileges.push(controlPrivilege)
                counter++
            });
        }

        admin.accessToken = dalObject.accessToken;
        admin.createdAt = dalObject.createdAt;

        return admin;
    }

    toDAL(domainObject: DomainAdmin): DALAdmin {
        let admin = new DALAdmin();
        admin._id = domainObject._id;
        admin.username = domainObject.username;
        admin.isLoggedIn = domainObject.isLoggedIn;
        admin.online = domainObject.online;
        admin.password = domainObject.password;
        //admin.privileges = domainObject.privileges;
        admin.accessToken = domainObject.accessToken;
        admin.createdAt = domainObject.createdAt;
        return admin;
    }
}