import {controller, httpPost, interfaces, request, response} from "inversify-express-utils";
import {TYPES} from "../domain/types";
import {inject} from "inversify";
import {Request, Response} from "express";
import {UserInterestService} from "../domain/services/UserInterestService";

@controller('/user/interests')
export class UserInterestContoller implements interfaces.Controller {

    constructor(@inject(TYPES.UserInterestService) private service: UserInterestService){}

    @httpPost('/add')
    public async add(@request() req: Request, @response() res: Response){
        await this.service.addInterest(req.body)
            .then((r) => {
                res.status(200).send({message: r, error: false});
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
}