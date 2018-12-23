import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DomainUser} from "../entities/DomainUser";
import {AuthRepository} from "../models/auth/AuthRepository";

@injectable()
export class AuthService {
    constructor(@inject(TYPES.AuthRepository) private repository: AuthRepository){}

    public async register(userDate: any): Promise<DomainUser>{
        return await new Promise<DomainUser>((resolve, reject) => {
            const name = userDate.name;
            const email = userDate.email;
            const password = userDate.password;
            const phone = userDate.phone;
            const gender = userDate.gender;
            const lang = userDate.lang;
            if(email && name && password && phone && gender && lang){
                let data: DomainUser = new DomainUser();
                data.name = name;
                data.email = email;
                data.password = password;
                data.phone = phone;
                data.gender = gender;
                data.lang = lang;
                this.repository.register(data)
                    .then((user: DomainUser) => {
                       resolve(user);
                    }).catch((err) => {
                        reject(err);
                    });
            } else {
                reject('name, email, password, phone adn gender fields are required');
            }
        });
    }

    public async login(data: any): Promise<DomainUser> {
        return await new Promise<DomainUser>((resolve, reject) => {
            if(data.email && data.password){
                this.repository.login(data.email, data.password)
                    .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
            } else {
                reject('email and password fields are required');
            }
        });
    }
}