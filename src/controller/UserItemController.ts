import {inject, injectable} from "inversify";
import {controller, httpPost, interfaces, request, response, httpGet} from "inversify-express-utils";
import {TYPES} from "../domain/types";
import {UserItemService} from "../domain/services/UserItemService";
import {Request, Response} from "express";

@controller('/user/items')
export class UserItemController implements interfaces.Controller {
    constructor(@inject(TYPES.UserItemService) private service: UserItemService){}

    @httpPost('/add-inner')
    public async addItem(@request() req: Request, @response() res: Response){
        await this.service.addItem(req.body, req.headers)
            .then((r) => {
                res.status(200).send({item: r, error: false});
            }).catch((err) => {
                console.log(err)
                res.status(500).send({message: err, error: true});
            });
    }

    @httpGet('/available')
    public async getAvailableUserItems(@request() req: Request, @response() res: Response){
        await this.service.getAvailableUserItems(req.headers)
            .then((r) => {
                res.status(200).send({item: r, error: false});
            }).catch((err) => {
                console.log(err)
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/swapped')
    public async getSwappedUserItems(@request() req: Request, @response() res: Response){
        await this.service.getSwappedUserItems(req.headers)
            .then((r) => {
                res.status(200).send({item: r, error: false});
            }).catch((err) => {
                console.log(err)
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/home')
    public async getHomeUserItems(@request() req: Request, @response() res: Response){
        await this.service.getHomeUserItems(req.headers)
            .then((r) => {
                res.status(200).send({item: r, error: false});
            }).catch((err) => {
                console.log(err)
                res.status(200).send({message: err, error: true});
            });
    }
}