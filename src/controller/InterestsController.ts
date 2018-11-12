import * as express from 'express';
import {controller, httpPost, interfaces, request, response} from "inversify-express-utils";
import {inject} from "inversify";
import {AdminRepository} from "../domain/models/admin/AdminRepository";
import {DomainInterest} from "../domain/entities/DomainInterest";
import {TYPES} from "../domain/types";
import {DomainAdmin} from "../domain/entities/DomainAdmin";

@controller('/admin/interests')
export class InterestsController implements interfaces.Controller {

    constructor(@inject(TYPES.AdminRepository) private _repository: AdminRepository){}

    @httpPost('/add')
    private async addInterest(@request() req: express.Request, @response() res: express.Response){
        let name = req.body.name;
        let imageUrl = req.body.image;
        let adminId = req.body.adminId;

        if (name && adminId){
            let interest = new DomainInterest();
            interest.name = name;
            interest.created_by = new DomainAdmin();
            interest.created_by._id = adminId;
            await this._repository.addInterest(adminId, interest)
                .then((r) => {
                    res.status(200).send({message: r, error: false});
                }).catch((err) => {
                    res.status(200).send({message: err, error: true});
                });
        } else {
            res.status(200).send({message: 'name and adminId are required', error: true});
        }
    }
}