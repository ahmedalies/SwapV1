import * as express from 'express';
import { interfaces, controller, httpPost, request, response, BaseHttpController, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from '../../node_modules/inversify';
import { TYPES } from '../domain/types';
import { AuthRepository } from '../domain/models/interfaces/AuthRepository';
import { MongoUser } from '../infrastructure/dal/entities/mongo/MongoUser';

@controller('/user/auth')
export class AuthController implements interfaces.Controller{

    constructor(@inject(TYPES.AuthRepository) private _repositry: AuthRepository){}
    

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
            res.status(200).send({user: error, error: true});
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
                let data: MongoUser = new MongoUser();
                data.name = name;
                data.email = email;
                data.password = password;
                data.phone = phone;
                await this._repositry.create(data)
                .then((user: MongoUser) => {
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