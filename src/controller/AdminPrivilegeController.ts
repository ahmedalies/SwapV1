import {controller, httpPost, interfaces, request, response} from "inversify-express-utils";
import {Request, Response} from "express";
import {inject} from "inversify";
import {TYPES} from "../domain/types";
import {AdminRepository} from "../domain/models/admin/AdminRepository";

@controller('/admin/privilege')
export class AdminPrivilegeController implements interfaces.Controller {

    constructor(@inject(TYPES.AdminRepository) private _repository: AdminRepository){}

    @httpPost('/assign')
    private async assingAdminPrivilege(@request() req: Request, @response() res: Response){
        const adminId = req.body.adminId;
        const creatorId = req.body.creatorId;
        const privilegeName = req.body.privilegeName;

        if (adminId && creatorId && privilegeName){
            await this._repository.assingAdminPrivilege(creatorId, adminId, privilegeName)
                .then((r) => {
                    res.status(200).send({admin: r, error: false});
                }).catch((err) => {
                    res.status(200).send({message: err, error: true});
                });
        } else {
            res.status(200).send({message: 'creatorId, adminId and priviliegeName are required fields', error: true});
        }
    }
}