import { DALAdmin } from "./DALAdmin";

export class DALInterest {
    _id: string;
    created_at: Date;
    name: string;
    created_by: DALAdmin;
    image_url: string;   
}