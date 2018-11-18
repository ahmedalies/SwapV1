import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DomainItem} from "../entities/DomainItem";
import {UserRepository} from "../models/user/UserRepository";

@injectable()
export class UserItemService {
    constructor(@inject(TYPES.UserRepository) private repository: UserRepository){}

    public async addItem(object: any): Promise<DomainItem>{
        let item: DomainItem = new DomainItem();

        if (object.owner){item.owner = object.owner}
        else {return Promise.reject('owner field does\'t exist')}

        if (object.name){item.name= object.name}
        else {return Promise.reject('user_item name field does\'t exist')}

        if (object.description){item.description = object.description}
        else {return Promise.reject('user_item description field does\'t exist')}

        if (object.category){item.category= object.category}
        else {return Promise.reject('user_item category field does\'t exist')}

        await this.repository.addItem(item)
            .then((res) => {
                return Promise.resolve(res);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }
}