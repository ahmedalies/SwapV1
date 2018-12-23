import { DomainControlPrivilege } from "./DomainControlPrivilege";

export class DomainAdmin {
    id: number;
    _id: string;
    isLoggedIn: string;
    online: string;
    createdAt: string;
    username: string;
    password: string;
    accessToken: string;
    privileges: DomainControlPrivilege[];
}