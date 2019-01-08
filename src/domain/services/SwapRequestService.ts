import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../models/user/UserRepository";
import {DomainSwapRequest} from "../entities/DomainSwapRequest";
import {DomainItem} from "../entities/DomainItem";
import {DomainUser} from "../entities/DomainUser";
import { SwapRequestTypes } from "../models/swap_request/SwapRequestTypes";

@injectable()
export class SwapRequestService {
    constructor(@inject(TYPES.UserRepository) private repository: UserRepository){}

    public async askForSwap(data: any, headers: any): Promise<DomainSwapRequest> {
        let senderItem: DomainItem, receiverItem: DomainItem;

        if (data.receiverItem){receiverItem = new DomainItem(); receiverItem._id = data.receiverItem}
        else {return Promise.reject('receiverItem field does\'t exist')}

        if (data.senderItem){senderItem = new DomainItem(); senderItem._id = data.senderItem}
        else {return Promise.reject('senderItem field does\'t exist')}

        let swap: DomainSwapRequest = new DomainSwapRequest();
        swap.senderItem = senderItem;
        swap.receiverItem = receiverItem;

        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.ask(swap, headers['accesstoken'])
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
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.accept(headers['accesstoken'], data.requestId)
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
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.reject(headers['accesstoken'], data.requestId, null)
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

    public async getRunning(data: any, headers: any): Promise<DomainSwapRequest[]> {
        return await new Promise<DomainSwapRequest[]>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getSwapRequestsForUser(headers['accesstoken'], SwapRequestTypes.RUNNING)
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

    public async getAccepted(data: any, headers: any): Promise<DomainSwapRequest[]> {
        return await new Promise<DomainSwapRequest[]>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getSwapRequestsForUser(headers['accesstoken'], SwapRequestTypes.ACCEPTED)
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

    public async getRejected(data: any, headers: any): Promise<DomainSwapRequest[]> {
        return await new Promise<DomainSwapRequest[]>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getSwapRequestsForUser(headers['accesstoken'], SwapRequestTypes.REJECTED)
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

    public async getOneSwap(data: any, headers: any): Promise<DomainSwapRequest> {
        if (data.requestId){}
        else {return Promise.reject('requestId does\'t exist')}

        return await new Promise<DomainSwapRequest>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getOneSwap(headers['accesstoken'], data.requestId)
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
