import { MongoUser } from "./MongoUser";

export class MongoBusinessUser extends MongoUser {
    upToSwaps: string;
    businessCreatedAt: Date;
}