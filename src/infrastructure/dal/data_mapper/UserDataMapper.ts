import { EntityDataMapper } from "../interfaces/EntityDataMapper";
import { DomainUser } from "../../../domain/entities/DomainUser";
import { DALUser } from "../../entities/dal/DALUser";
import { injectable } from "inversify";
import {mongo} from "mongoose";

@injectable()
export class UserDataMapper implements EntityDataMapper<DomainUser, DALUser> {
    
    public toDomain(mongoUser: DALUser): DomainUser {
        let domainUser: DomainUser = new DomainUser();
        domainUser._id = mongoUser._id;
        domainUser.avatar = mongoUser.avatar;
        domainUser.created_at = mongoUser.created_at;
        domainUser.email = mongoUser.email; 
        domainUser.name = mongoUser.name;
        domainUser.password = mongoUser.password;
        domainUser.phone = mongoUser.phone;
        domainUser.status = mongoUser.status;
        domainUser.userType = mongoUser.userType;
        domainUser.accessToken = mongoUser.accessToken;
        return domainUser;
    }

    public toDAL(domainUser: DomainUser): DALUser {
        let mongoUser: DALUser = new DALUser();
        mongoUser._id = domainUser._id;
        mongoUser.avatar = domainUser.avatar;
        mongoUser.created_at = domainUser.created_at;
        mongoUser.email = domainUser.email; 
        mongoUser.name = domainUser.name;
        mongoUser.password = domainUser.password;
        mongoUser.phone = domainUser.phone;
        mongoUser.status = domainUser.status;
        mongoUser.userType = domainUser.userType;
        mongoUser.accessToken = domainUser.accessToken;
        return mongoUser;
    }
}