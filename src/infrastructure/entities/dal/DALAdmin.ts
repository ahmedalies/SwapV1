import { DALControlPrivilege } from "./DALControlPrivilege";

export class DALAdmin {
    id: number;
    _id: string;
    isLoggedIn: string;
    online: string;
    createdAt: string;
    username: string;
    password: string;
    accessToken: string;
    uniqueAddedElement: any[];
    //privileges: string[];
}