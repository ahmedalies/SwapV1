import { DALControlPrivilege } from "./DALControlPrivilege";

export class DALAdmin {
    _id: string;
    isLoggedIn: string;
    online: string;
    createdAt: string;
    username: string;
    password: string;
    accessToken: string;
    privileges: [];
}