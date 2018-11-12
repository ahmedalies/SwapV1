import {controller, httpPost, interfaces, request, response} from "inversify-express-utils";
import {Request, Response} from "express";
import {inject} from "inversify";
import {TYPES} from "../domain/types";
import {AdminRepository} from "../domain/models/admin/AdminRepository";
import {DomainAdmin} from "../domain/entities/DomainAdmin";

@controller('/admin')
export class AdminController implements interfaces.Controller {
    constructor(@inject(TYPES.AdminRepository) private _repository: AdminRepository){}

    @httpPost('/create')
    private async createAdmin(@request() req: Request, @response() res: Response){
        const username = req.body.username;
        const password = req.body.password;
        const creatorId = req.body.creatorId;

        if (username && password && creatorId){
            let admin = new DomainAdmin();
            admin.username = username;
            admin.password = password;
            await this._repository.createAdmin(creatorId, admin)
                .then((r) => {
                    res.status(200).send({admin: r, error: false});
                }).catch((err) => {
                    res.status(200).send({message: err, error: true});
                });
        } else {
            res.status(200).send({message: 'username and password are required fields', error: true});
        }
    }
}