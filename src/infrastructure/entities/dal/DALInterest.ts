import { DALAdmin } from "./DALAdmin";

export class DALInterest {
    id: number;
    _id: string;
    created_at: Date;
    name: string;
    nameAR: string
    created_by: DALAdmin;
    image_url: string;   
}