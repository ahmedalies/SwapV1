import {inject, injectable} from "inversify";
import {controller, httpPost, interfaces, request, response} from "inversify-express-utils";
import {TYPES} from "../domain/types";
import {UserItemService} from "../domain/services/UserItemService";
import {Request, Response} from "express";

@controller('/user/items')
export class UserItemController implements interfaces.Controller {
    constructor(@inject(TYPES.UserItemService) private service: UserItemService){}

    @httpPost('/add')
    public async addItem(@request() req: Request, @response() res: Response){
        await this.service.addItem(req.body, req.headers)
            .then((r) => {
                res.status(200).send({item: r, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
}