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

        if (body.name){item.name = body.name}
        else {return Promise.reject('user_item name field does\'t exist')}

        if (body.description){item.description = body.description}
        else {return Promise.reject('user_item description field does\'t exist')}

        if (body.category){ item.category= new DomainInterest(); item.category._id = body.category;}
        else {return Promise.reject('user_item category field does\'t exist')}

        if (body.iUrls){ item.i_urls = body.iUrls;}
        else {return Promise.reject('user_item iUrls field does\'t exist')}

        return await new Promise<DomainItem>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.addItem(item, headers['accesstoken'])
                            .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        console.log('session expired')
                        reject('session expired'); 
                    }
                }).catch((err) => {
                    console.log('invalid')
                    reject('session expired or invalid access token, try login');
                })
            } else {console.log('access denied');return Promise.reject('access denied')}
        });
    }

    public async getAvailableUserItems(headers: any): Promise<DomainItem[]>{
        return await new Promise<DomainItem[]>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getAvailableUserItems(headers['accesstoken'])
                            .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        console.log('session expired')
                        reject('session expired'); 
                    }
                }).catch((err) => {
                    console.log('invalid')
                    reject('session expired or invalid access token, try login');
                })
            } else {console.log('access denied');return Promise.reject('access denied')}
        });
    }

    public async getSwappedUserItems(headers: any): Promise<DomainItem[]>{
        return await new Promise<DomainItem[]>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getSwappedUserItems(headers['accesstoken'])
                            .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        console.log('session expired')
                        reject('session expired'); 
                    }
                }).catch((err) => {
                    console.log('invalid')
                    reject('session expired or invalid access token, try login');
                })
            } else {console.log('access denied');return Promise.reject('access denied')}
        });
    }

    public async getHomeUserItems(headers: any): Promise<DomainItem[]>{
        return await new Promise<DomainItem[]>((resolve, reject) => {
            if (headers && headers['accesstoken']) {
                this.repository.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res){
                        this.repository.getHome(headers['accesstoken'])
                            .then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                            });
                    } else {
                        console.log('session expired')
                        reject('session expired'); 
                    }
                }).catch((err) => {
                    console.log('invalid')
                    reject('session expired or invalid access token, try login');
                })
            } else {console.log('access denied');return Promise.reject('access denied')}
        });
    }
}