import {DALInterest} from "./DALInterest";

export  class DALItem {
    _id: string;
    status: string;
    onWeekMilli: number;
    owner: string;
    name: string;
    description: string;
    category: DALInterest;
    i_urls: any[];
    createdAt: Date;
}