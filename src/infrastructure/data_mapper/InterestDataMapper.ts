import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainInterest} from "../../domain/entities/DomainInterest";
import {DALInterest} from "../entities/dal/DALInterest";
import {injectable} from "inversify";

@injectable()
export class InterestDataMapper implements EntityDataMapper<DomainInterest, DALInterest> {

    toDAL(domainObject: DomainInterest): DALInterest {
        let interest = new DALInterest();
        interest.id = domainObject.id;
        interest._id = domainObject._id;
        //interest.created_at = domainObject.created_at;
        interest.image_url = domainObject.image_url;
        interest.name = domainObject.name;
        interest.nameAR = domainObject.nameAR;
        //interest.created_by = domainObject.created_by;
        return interest;
    }

    toDomain(dalObject: DALInterest): DomainInterest {
        let interest = new DomainInterest();
        interest.id = dalObject.id;
        interest._id = dalObject._id;
        interest.name = dalObject.name;
        interest.image_url = dalObject.image_url;
        interest.created_at = dalObject.created_at;
        interest.nameAR = dalObject.nameAR;
        //interest.created_by = dalObject.created_by;
        return interest;
    }
}