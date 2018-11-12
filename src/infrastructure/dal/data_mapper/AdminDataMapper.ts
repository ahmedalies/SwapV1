import {injectable} from "inversify";
import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainAdmin} from "../../../domain/entities/DomainAdmin";
import {DALAdmin} from "../../entities/dal/DALAdmin";

@injectable()
export class AdminDataMapper implements EntityDataMapper<DomainAdmin, DALAdmin> {

    toDomain(dalObject: DALAdmin): DomainAdmin {
        let admin = new DomainAdmin();
        admin._id = dalObject._id;
        admin.username = dalObject.username;
        admin.isLoggedIn = dalObject.isLoggedIn;
        admin.online = dalObject.online;
        admin.password = dalObject.password;
        admin.privileges = dalObject.privileges;
        admin.accessToken = dalObject.accessToken;
        admin.createdAt = dalObject.createdAt;
        return null;
    }

    toDAL(domainObject: DomainAdmin): DALAdmin {
        let admin = new DALAdmin();
        admin._id = domainObject._id;
        admin.username = domainObject.username;
        admin.isLoggedIn = domainObject.isLoggedIn;
        admin.online = domainObject.online;
        admin.password = domainObject.password;
        admin.privileges = domainObject.privileges;
        admin.accessToken = domainObject.accessToken;
        admin.createdAt = domainObject.createdAt;
        return null;
    }
}