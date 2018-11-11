import { Repository } from "./Repository";
import { DomainUser } from "../../entities/DomainUser";

export interface AuthRepository extends Repository<DomainUser> {
    login(email: string, password: string): Promise<DomainUser>;
    register(user: DomainUser): Promise<DomainUser>;
}