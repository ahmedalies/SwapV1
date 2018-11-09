import { Repository } from "./Repository";
import { DomainUser } from "../../entities/DomainUser";

export interface AuthRepository extends Repository<DomainUser> {
    //custom methods belong only to AuthRepository
    login(email: string, password: string): Promise<DomainUser>;
}