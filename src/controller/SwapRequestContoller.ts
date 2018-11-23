import {inject} from "inversify";
import {controller, httpPost, interfaces, request, response} from "inversify-express-utils";
import {TYPES} from "../domain/types";
import {Request, Response} from "express";
import {DomainSwapRequest} from "../domain/entities/DomainSwapRequest";

@controller('/user/request')
export class SwapRequestContoller implements interfaces.Controller {

    constructor(@inject(TYPES.SwapRequestService) private service){}

    @httpPost('/ask-for-swap')
    public async askSwap(@request() req: Request, @response() res: Response){
        await this.service.askForSwap(req.body)
            .then((r) => {
                if (r.message) {
                    res.status(200).send({message: r.message, request: r, error: true});
                } else {
                    res.status(200).send({request: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
}