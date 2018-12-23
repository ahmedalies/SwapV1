import {UserRepository} from "../models/user/UserRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DomainUserInterests} from "../entities/DomainUserInterests";
import { resolve } from "url";
import { DomainInterest } from "../entities/DomainInterest";

@injectable()
export class UserInterestService {
    constructor(@inject(TYPES.UserRepository) private userRepo: UserRepository) {}

    public async addInterest(body: any, headers: any): Promise<DomainUserInterests> {
        let interest: DomainUserInterests = new DomainUserInterests();

        // if (body.userId){interest.userId = body.userId}
        // else {return Promise.reject('userId is missing')}

        if (body.interests && body.interests.length){interest.interests = body.interests}
        else {return Promise.reject('interests array is missing or empty')}

        if (headers['accesstoken']){
            return await new Promise<DomainUserInterests>((resolve, reject) => {
                this.userRepo.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res) {
                        this.userRepo.addInterests(interest, headers['accesstoken'])
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                    } else {
                        reject('session expired');    
                    }
                }).catch((err) => {
                    reject('session expired or invalid access token, try login');
                });
            });
   
        } else {return Promise.reject('access denied')}
    }

    public async getUserInterests(body: any, headers: any): Promise<DomainUserInterests> {
        if (!body.userId){return Promise.reject('userId is missing')}

        if (headers['accesstoken']){
            return await new Promise<DomainUserInterests>((resolve, reject) => {
                this.userRepo.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res) {
                        this.userRepo.getInterests(body.userId)
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                    } else {
                        reject('session expired');    
                    }
                }).catch((err) => {
                    reject('session expired or invalid access token, try login');
                });
            });
   
        } else {return Promise.reject('access denied')}
    }

    public async getAllInterests(headers: any): Promise<DomainInterest[]> {
        if (headers['accesstoken']){
            return await new Promise<DomainInterest[]>((resolve, reject) => {
                this.userRepo.isValidAccessToken(headers['accesstoken'])
                .then((res) => {
                    if(res) {
                        this.userRepo.getAllInterests()
                        .then((res) => {
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        });
                    } else {
                        reject('session expired');    
                    }
                }).catch((err) => {
                    reject('session expired or invalid access token, try login');
                });
            });
   
        } else {return Promise.reject('access denied')}
    }
}