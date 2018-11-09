import { EntityDataMapper } from "../interfaces/EntityDataMapper";
import { DomainUser } from "../../../domain/entities/DomainUser";
import { MongoUser } from "../entities/mongo/MongoUser";
import { injectable } from "../../../../node_modules/inversify";

@injectable()
export class AuthDataMapper implements EntityDataMapper<DomainUser, MongoUser> {
    
    public toDomain(mongoUser: MongoUser): DomainUser {
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
        return domainUser;
    }

    public toDAL(domainUser: DomainUser): MongoUser {
        let mongoUser: MongoUser = new MongoUser();
        mongoUser._id = domainUser._id;
        mongoUser.avatar = domainUser.avatar;
        mongoUser.created_at = domainUser.created_at;
        mongoUser.email = domainUser.email; 
        mongoUser.name = domainUser.name;
        mongoUser.password = domainUser.password;
        mongoUser.phone = domainUser.phone;
        mongoUser.status = domainUser.status;
        mongoUser.userType = domainUser.userType;
        return mongoUser;
    }
}