import { Repository } from "./Repository";
import { DomainUser } from "../../entities/DomainUser";
import { MongoUser } from "../../../infrastructure/dal/entities/mongo/MongoUser";

export interface AuthRepository extends Repository<DomainUser> {
    //custom methods belong only to AuthRepository
    login(email: string, password: string): Promise<DomainUser>;
    create(data: MongoUser): Promise<DomainUser>;
}