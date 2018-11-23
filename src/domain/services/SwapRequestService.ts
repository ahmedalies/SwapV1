import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../models/user/UserRepository";
import {DomainSwapRequest} from "../entities/DomainSwapRequest";
import {DomainItem} from "../entities/DomainItem";
import {DomainUser} from "../entities/DomainUser";

@injectable()
export class SwapRequestService {
    constructor(@inject(TYPES.UserRepository) private repository: UserRepository){}

    public async askForSwap(data: any): Promise<DomainSwapRequest> {
        let senderItem: DomainItem, receiverItem: DomainItem;
        let senderUser: DomainUser, receiverUser: DomainUser;

        if (data.senderItem){senderItem = new DomainItem(); senderItem._id = data.senderItem}
        else {return Promise.reject('senderItem field does\'t exist')}

        if (data.receiverItem){receiverItem = new DomainItem(); receiverItem._id = data.receiverItem}
        else {return Promise.reject('receiverItem field does\'t exist')}

        if (data.senderUser){senderUser = new DomainUser(); senderUser._id = data.senderUser; senderItem.owner = senderUser}
        else {return Promise.reject('senderUser field does\'t exist')}

        if (data.receiverUser){receiverUser = new DomainUser(); receiverUser._id = data.receiverUser; receiverItem.owner = receiverUser}
        else {return Promise.reject('receiverUser field does\'t exist')}

        let swap: DomainSwapRequest = new DomainSwapRequest();
        swap.senderItem = senderItem;
        swap.receiverItem = receiverItem;

        return await new Promise<DomainSwapRequest>((resolve, reject) => {
             this.repository.ask(swap)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
