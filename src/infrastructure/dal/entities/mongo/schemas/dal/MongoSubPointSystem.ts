import { MongoPointSystem } from "./MongoPointSystem";

export class MongoSubPointSystem {
    _id: string;
    pointSystem: MongoPointSystem;
    functionName: string;
    value: string;
    created_at: Date;
}