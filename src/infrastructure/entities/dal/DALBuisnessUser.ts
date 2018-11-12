import { DALUser } from "./DALUser";

export class DALBusinessUser extends DALUser {
    upToSwaps: string;
    businessCreatedAt: Date;
}