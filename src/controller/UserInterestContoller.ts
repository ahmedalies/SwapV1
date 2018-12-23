import {controller, httpPost, interfaces, request, response, httpGet} from "inversify-express-utils";
import {TYPES} from "../domain/types";
import {inject} from "inversify";
import {Request, Response} from "express";
import {UserInterestService} from "../domain/services/UserInterestService";

@controller('/user/interests')
export class UserInterestContoller implements interfaces.Controller {

    constructor(@inject(TYPES.UserInterestService) private service: UserInterestService){}

    @httpPost('/add')
    public async add(@request() req: Request, @response() res: Response){
        await this.service.addInterest(req.body, req.headers)
            .then((r) => {
                res.status(200).send({response: r, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/:userId')
    public async getUserInterests(@request() req: Request, @response() res: Response){
        await this.service.getUserInterests(req.params, req.headers)
            .then((r) => {
                res.status(200).send({response: r, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/')
    private async getAll(@request() req: Request, @response() res: Response){
        await this.service.getAllInterests(req.headers)
            .then((r) => {
                res.status(200).send({interests: r, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
}