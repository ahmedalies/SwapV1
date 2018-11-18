import {Repository} from "../base/Repository";
import {DomainUserInterests} from "../../entities/DomainUserInterests";

export interface UserInterestsRepository extends Repository<DomainUserInterests> {
    add(object: DomainUserInterests): Promise<DomainUserInterests>;
    get(userId: string): Promise<DomainUserInterests>;
    removeOne(interestId: string, userId: string): Promise<boolean>;
    removeAll(userId: string): Promise<boolean>;
}