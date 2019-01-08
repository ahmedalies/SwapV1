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
            let namesAR = dalObject.uniqueAddedElement['nameAR'];
            let imageUrls = dalObject.uniqueAddedElement['image_url'];
            let i_ds = dalObject.uniqueAddedElement['i_id'];
            let iIds = dalObject.uniqueAddedElement['iId'];

            let counter = 0;
            userInterest.interests = [];
            if(names && names.length) {
                names.forEach(element => {
                    let i = {
                        id: iIds[counter],
                        _id: i_ds[counter],
                        name: element,
                        imageUrl: imageUrls[counter]
                    }
                    userInterest.interests.push(i);
                    counter++
                });
            }
            counter = 0;
            if(namesAR && namesAR.length){
                namesAR.forEach(element => {
                    let i = userInterest.interests[counter];
                    i.nameAR = element;
                    userInterest.interests[counter] = i;
                    counter++
                });
            }
        }

        return userInterest;
    }
}