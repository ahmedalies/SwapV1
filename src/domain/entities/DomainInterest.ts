import { DomainAdmin } from "./DomainAdmin";

export class DomainInterest {
    _id: string;
    created_at: Date;
    name: string;
    created_by: DomainAdmin;
    image_url: string;   
}