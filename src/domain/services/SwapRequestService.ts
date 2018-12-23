import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../models/user/UserRepository";
import {DomainSwapRequest} from "../entities/DomainSwapRequest";
import {DomainItem} from "../entities/DomainItem";
import {DomainUser} from "../entities/DomainUser";

@injectable()
export class SwapRequestService {
    constructor(@inject(TYPES.UserRepository) private repository: UserRepository){}

    public async askForSwap(data: any, headers: any): Promise<DomainSwapRequest> {
        let senderItem: DomainItem, receiverItem: DomainItem;

        if (data.senderItem){senderItem = new DomainItem(); senderItem._id = data.senderItem}
        else {return Promise.reject('senderItem field does\'t exist')}

        if (data.receiverItem){receiverItem = new DomainItem(); receiverItem._id = data.receiverItem}
        else {return Promise.reject('receiverItem field does\'t exist')}

        let swap: DomainSwapRequest = new DomainSwapRequest();
        swap.senderItem = senderItem;
        swap.receiverItem = receiverItem;

        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            if (headers && headers['access-token']) {
                this.repository.isValidAccessToken(headers['access-token'])
                .then((res) => {
                    if(res){
                        this.repository.ask(swap, headers['access-token'])
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
            } else {return reject('access denied')}
        });
    }

    public async accept(data: any, headers: any): Promise<boolean> {

        if (data.requestId){}
        else {return Promise.reject('requestId does\'t exist')}

        return await new Promise<boolean>((resolve, reject) => {
            if (headers && headers['access-token']) {
                this.repository.isValidAccessToken(headers['access-token'])
                .then((res) => {
                    if(res){
                        this.repository.accept(headers['access-token'], data.requestId)
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
            } else {return reject('access denied')}
        });
    }

    public async rejectSwap(data: any, headers: any): Promise<boolean> {

        if (data.requestId){}
        else {return Promise.reject('requestId does\'t exist')}

        return await new Promise<boolean>((resolve, reject) => {
            if (headers && headers['access-token']) {
                this.repository.isValidAccessToken(headers['access-token'])
                .then((res) => {
                    if(res){
                        this.repository.reject(headers['access-token'], data.requestId, null)
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
            } else {return reject('access denied')}
        });
    }
}
