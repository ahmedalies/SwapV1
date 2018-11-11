import { MongoControlPrivilege } from "./MongoControlPrivilege";

export class MongoAdmin {
    _id: string;
    isLoggedIn: string;
    online: string;
    createdAt: string;
    username: string;
    password: string;
    privilege: [MongoControlPrivilege];
}