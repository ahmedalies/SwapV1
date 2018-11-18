import {UserRepository} from "../models/user/UserRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DomainUserInterests} from "../entities/DomainUserInterests";

@injectable()
export class UserInterestService {

    constructor(@inject(TYPES.UserRepository) private userRepo: UserRepository) {}

    public async addInterest(object: any): Promise<DomainUserInterests> {
        let interest: DomainUserInterests = new DomainUserInterests();

        if (object.userId){interest.userId = object.userId}
        else {return Promise.reject('userId is missing')}

        if (object.interests && object.interests.length){interest.interests = object.interests}
        else {return Promise.reject('interests array is missing or empty')}

        return await this.userRepo.addInterests(interest)
            .then((res) => {
                return Promise.resolve(res)
            }).catch((err) => {
                return Promise.reject(err)
            });
    }
}