import {DomainInterest} from "./DomainInterest";
import {DomainUser} from "./DomainUser";

export class DomainItem {
    id: number;
    _id: string;
    status: string;
    statusString: string;
    oneWeekMilli: number;
    owner: DomainUser;
    name: string;
    description: string;
    category: DomainInterest;
    i_urls: any[];
    createdAt: number;
}