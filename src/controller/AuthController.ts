import * as express from 'express';
import { interfaces, controller, httpPost, request, response, BaseHttpController, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES as DOMAIN_TYPES } from '../domain/types';
import { AuthRepository } from '../domain/models/auth/AuthRepository';
import { DALUser } from '../infrastructure/entities/dal/DALUser';
import {DomainUser} from "../domain/entities/DomainUser";

@controller('/user/auth')
export class AuthController implements interfaces.Controller{

    constructor(@inject(DOMAIN_TYPES.AuthRepository) private _repositry: AuthRepository){}
    
    @httpPost('/login')
    private async login(@request() req: express.Request, @response() res: express.Response){
        try {
            if(req.body.email && req.body.password){
                const user = await this._repositry.login(req.body.email, req.body.password)
                res.status(200).send({user: user, error: false});
            } else {
                res.status(200).send({message: 'email and password field are required', error: true});
            }
        } catch (error) {
            res.status(200).send({message: error, error: true});
        }
    }

    @httpPost('/register')
    private async create(@request() req: express.Request, @response() res:express.Response){
        try {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const phone = req.body.phone;
            if(email && name && password && phone){
                let data: DomainUser = new DomainUser();
                data.name = name;
                data.email = email;
                data.password = password;
                data.phone = phone;
                await this._repositry.register(data)
                .then((user: DomainUser) => {
                    res.status(200).send({user: user, error: false});
                }).catch((err) => {
                    res.status(200).send({message: err, error: true});
                })
               
            } else {
                res.status(200).send({message: 'email and password field are required', error: true});
            }
        } catch (error) {
            res.status(200).send({message: error.message, error: true});
        }
    }
}