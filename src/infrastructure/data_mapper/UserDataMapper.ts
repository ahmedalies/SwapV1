import { EntityDataMapper } from "../interfaces/EntityDataMapper";
import { DomainUser } from "../../domain/entities/DomainUser";
import { DALUser } from "../entities/dal/DALUser";
import { injectable } from "inversify";

@injectable()
export class UserDataMapper implements EntityDataMapper<DomainUser, DALUser> {
    
    public toDomain(dalUser: DALUser): DomainUser {
        let domainUser: DomainUser = new DomainUser();
        domainUser.id = dalUser.id;
        domainUser._id = dalUser._id;
        domainUser.avatar = dalUser.avatar;
        domainUser.created_at = dalUser.created_at;
        domainUser.email = dalUser.email;
        domainUser.name = dalUser.username;
        domainUser.password = dalUser.password;
        domainUser.phone = dalUser.phone;
        domainUser.gender = dalUser.gender;
        domainUser.status = dalUser.status;
        domainUser.userType = dalUser.userType;
        domainUser.accessToken = dalUser.accessToken;
        domainUser.statusString = dalUser.statusString;
        domainUser.typeString = dalUser.typeString;
        domainUser.lang = dalUser.lang;
        domainUser.isValidToken = Date.now() < dalUser.validAccessTokenTill;
        
        return domainUser;
    }

    public toDAL(domainUser: DomainUser): DALUser {
        let dalUser: DALUser = new DALUser();
        dalUser.id = domainUser.id;
        dalUser._id = domainUser._id;
        dalUser.avatar = domainUser.avatar;
        dalUser.created_at = domainUser.created_at;
        dalUser.email = domainUser.email;
        dalUser.username = domainUser.name;
        dalUser.password = domainUser.password;
        dalUser.phone = domainUser.phone;
        dalUser.gender = domainUser.gender;
        dalUser.status = domainUser.status;
        dalUser.userType = domainUser.userType;
        dalUser.accessToken = domainUser.accessToken;
        dalUser.validAccessTokenTill = Date.now() + 2592000000;
        return dalUser;
    }
}