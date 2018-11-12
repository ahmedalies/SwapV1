import {EntityDataMapper} from "../interfaces/EntityDataMapper";
import {DomainInterest} from "../../../domain/entities/DomainInterest";
import {DALInterest} from "../../entities/dal/DALInterest";
import {injectable} from "inversify";

@injectable()
export class InterestDataMapper implements EntityDataMapper<DomainInterest, DALInterest> {

    toDAL(domainObject: DomainInterest): DALInterest {
        let interest = new DALInterest();
        interest._id = domainObject._id;
        interest.created_at = domainObject.created_at;
        interest.image_url = domainObject.image_url;
        interest.name = domainObject.name;
        interest.created_by = domainObject.created_by;
        return interest;
    }

    toDomain(dalObject: DALInterest): DomainInterest {
        let interest = new DomainInterest();
        interest.name = dalObject.name;
        interest.image_url = dalObject.image_url;
        interest.created_at = dalObject.created_at;
        interest._id = dalObject._id;
        interest.created_by = dalObject.created_by;
        return interest;
    }
}