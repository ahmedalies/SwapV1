import {DomainUserInterests} from "../../domain/entities/DomainUserInterests";
import {DALUserInterests} from "../entities/dal/DALUserInterests";
import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {injectable} from "inversify";

@injectable()
export class UserInterestsDataMapper implements EntityDataMapper<DomainUserInterests, DALUserInterests> {

    toDAL(domainObject: DomainUserInterests): DALUserInterests {
        let userInterest: DALUserInterests = new DALUserInterests();
        userInterest._id = domainObject._id;
        userInterest.userId = domainObject.userId;
        userInterest.interests = domainObject.interests;
        return userInterest;
    }

    toDomain(dalObject: DALUserInterests): DomainUserInterests {
        let userInterest: DomainUserInterests = new DomainUserInterests();
        userInterest._id = dalObject._id;
        userInterest.userId = dalObject.userId;
        userInterest.interests = dalObject.interests;
        return userInterest;
    }
}