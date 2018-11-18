import {DomainInterest} from "./DomainInterest";

export class DomainItem {
    _id: string;
    status: string;
    onWeekMilli: number;
    owner: string;
    name: string;
    description: string;
    category: DomainInterest;
    i_urls: any[];
    createdAt: Date;
}