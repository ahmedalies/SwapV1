import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DomainItem} from "../entities/DomainItem";
import {UserRepository} from "../models/user/UserRepository";
import {DomainInterest} from "../entities/DomainInterest";
import {DomainUser} from "../entities/DomainUser";

@injectable()
export class UserItemService {
    constructor(@inject(TYPES.UserRepository) private repository: UserRepository){}

    public async addItem(body: any, headers: any): Promise<DomainItem>{
        let item: DomainItem = new DomainItem();

        // if (body.owner){item.owner = new DomainUser(); item.owner._id = body.owner}
        // else {return Promise.reject('owner field does\'t exist')}

        if (body.name){item.name = body.name}
        else {return Promise.reject('user_item name field does\'t exist')}

        if (body.description){item.description = body.description}
        else {return Promise.reject('user_item description field does\'t exist')}

        if (body.category){ item.category= new DomainInterest(); item.category._id = body.category;}
        else {return Promise.reject('user_item category field does\'t exist')}

        return await new Promise<DomainItem>((resolve, reject) => {
            if (headers && headers['access-token']) {
                this.repository.isValidAccessToken(headers['access-token'])
                .then((res) => {
                    if(res){
                        this.repository.addItem(item, headers['access-token'])
                            .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        reject('session expired'); 
                    }
                }).catch((err) => {
                    reject('session expired or invalid access token, try login');
                })
            } else {return Promise.reject('access denied')}
        });
    }
}