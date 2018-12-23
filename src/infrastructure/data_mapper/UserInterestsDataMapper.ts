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
        if (dalObject._id)
            userInterest._id = dalObject._id;
        userInterest.userId = dalObject.userId;

        if(dalObject.uniqueAddedElement) {
            let names = dalObject.uniqueAddedElement['name'];
            let imageUrls = dalObject.uniqueAddedElement['image_url'];
            let ids = dalObject.uniqueAddedElement['i_id'];

            let counter = 0;
            userInterest.interests = [];
            if(names && names.length) {
                names.forEach(element => {
                    let i = {
                        _id: ids[counter],
                        name: element,
                        imageUrl: imageUrls[counter]
                    }
                    userInterest.interests.push(i);
                    counter++
                });
            }
        }

        return userInterest;
    }
}