import {DomainInterest} from "./DomainInterest";
import {DomainUser} from "./DomainUser";

export class DomainItem {
    _id: string;
    status: string;
    oneWeekMilli: number;
    owner: DomainUser;
    name: string;
    description: string;
    category: DomainInterest;
    i_urls: any[];
    createdAt: number;
}