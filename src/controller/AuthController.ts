import * as express from 'express';
import { interfaces, controller, httpPost, request, response, BaseHttpController, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES as DOMAIN_TYPES } from '../domain/types';
import { AuthRepository } from '../domain/models/auth/AuthRepository';
import { DALUser } from '../infrastructure/entities/dal/DALUser';
import {DomainUser} from "../domain/entities/DomainUser";
import {AuthService} from "../domain/services/AuthService";

@controller('/user/auth')
export class AuthController implements interfaces.Controller{

    constructor(@inject(DOMAIN_TYPES.AuthService) private _repositry: AuthService){}
    
    @httpPost('/login')
    private async login(@request() req: express.Request, @response() res: express.Response){
        await this._repositry.login(req.body)
            .then((r) => {
                res.status(200).send({user: r, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpPost('/register')
    private async create(@request() req: express.Request, @response() res:express.Response){
        await this._repositry.register(req.body)
            .then((user: DomainUser) => {
                res.status(200).send({user: user, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
}