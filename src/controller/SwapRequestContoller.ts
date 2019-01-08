import {inject} from "inversify";
import {controller, httpPost, interfaces, request, response, httpGet} from "inversify-express-utils";
import {TYPES} from "../domain/types";
import {Request, Response} from "express";
import { SwapRequestService } from "../domain/services/SwapRequestService";

@controller('/user/request')
export class SwapRequestContoller implements interfaces.Controller {

    constructor(@inject(TYPES.SwapRequestService) private service: SwapRequestService){}

    @httpPost('/ask')
    public async askSwap(@request() req: Request, @response() res: Response){
        await this.service.askForSwap(req.body, req.headers)
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

    @httpPost('/accept')
    public async acceptSwap(@request() req: Request, @response() res: Response){
        await this.service.accept(req.body, req.headers)
            .then((r) => {
                if (r) {
                    res.status(200).send({message: r, error: true});
                } else {
                    res.status(200).send({request: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpPost('/reject')
    public async rejectSwap(@request() req: Request, @response() res: Response){
        await this.service.rejectSwap(req.body, req.headers)
            .then((r) => {
                if (r) {
                    res.status(200).send({message: r, error: true});
                } else {
                    res.status(200).send({request: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/running')
    public async getRunning(@request() req: Request, @response() res: Response){
        await this.service.getRunning(req.body, req.headers)
            .then((r) => {
                if (r) {
                    res.status(200).send({requests: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/accepted')
    public async getAccepted(@request() req: Request, @response() res: Response){
        await this.service.getAccepted(req.body, req.headers)
            .then((r) => {
                if (r) {
                    res.status(200).send({requests: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }

    @httpGet('/rejected')
    public async getRejected(@request() req: Request, @response() res: Response){
        await this.service.getRejected(req.body, req.headers)
            .then((r) => {
                if (r) {
                    res.status(200).send({requests: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
    
    @httpGet('/:requestId')
    public async getOneSwap(@request() req: Request, @response() res: Response){
        await this.service.getOneSwap(req.params, req.headers)
            .then((r) => {
                if (r) {
                    res.status(200).send({request: r, error: false});
                }
            }).catch((err) => {
                res.status(200).send({message: err, error: true});
            });
    }
}