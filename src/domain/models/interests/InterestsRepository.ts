import {Repository} from "../base/Repository";
import {DomainInterest} from "../../entities/DomainInterest";
import {PrivilegeRepository} from "../privileges/PrivilegeRepository";
/**
 * Created by ahmed on 11/12/2018.
 */

export interface InterestsRepository extends Repository<DomainInterest> {
    addInterest(interest: DomainInterest): Promise<DomainInterest>;
    getInterest(id: string): Promise<DomainInterest>;
    getAllInterest(): Promise<DomainInterest[]>;
    updateInterest(id: string, interest: DomainInterest): Promise<DomainInterest>;
    deleteInterest(id: string): Promise<boolean>;
}
