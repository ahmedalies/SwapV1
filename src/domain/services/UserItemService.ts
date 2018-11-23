import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DomainItem} from "../entities/DomainItem";
import {UserRepository} from "../models/user/UserRepository";
import {DomainInterest} from "../entities/DomainInterest";
import {DomainUser} from "../entities/DomainUser";

@injectable()
export class UserItemService {
    constructor(@inject(TYPES.UserRepository) private repository: UserRepository){}

    public async addItem(object: any): Promise<DomainItem>{
        let item: DomainItem = new DomainItem();

        if (object.owner){item.owner = new DomainUser(); item.owner._id = object.owner}
        else {return Promise.reject('owner field does\'t exist')}

        if (object.name){item.name = object.name}
        else {return Promise.reject('user_item name field does\'t exist')}

        if (object.description){item.description = object.description}
        else {return Promise.reject('user_item description field does\'t exist')}

        if (object.category){ item.category= new DomainInterest(); item.category._id = object.category;}
        else {return Promise.reject('user_item category field does\'t exist')}

        return await new Promise<DomainItem>((resolve, reject) => {
            this.repository.isUserOngoing(item.owner._id)
                .then((res) => {
                    this.repository.addItem(item)
                        .then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}