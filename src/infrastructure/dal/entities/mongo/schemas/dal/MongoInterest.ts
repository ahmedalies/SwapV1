import { MongoAdmin } from "./MongoAdmin";

export class MongoInterest {
    _id: string;
    created_at: Date;
    name: string;
    created_by: MongoAdmin;
    image_url: string;   
}