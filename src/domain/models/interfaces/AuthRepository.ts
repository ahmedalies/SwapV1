import { Repository } from "./Repository";
import { DomainUser } from "../../entities/DomainUser";

export interface AuthRepository extends Repository<DomainUser> {
   
}