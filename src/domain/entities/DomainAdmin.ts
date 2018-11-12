import { DomainControlPrivilege } from "./DomainControlPrivilege";

export class DomainAdmin {
    _id: string;
    isLoggedIn: string;
    online: string;
    createdAt: string;
    username: string;
    password: string;
    accessToken: string;
    privileges: [];
}