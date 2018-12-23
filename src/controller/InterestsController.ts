import * as express from 'express';
import {controller, httpPost, interfaces, request, response, httpGet, httpPut} from "inversify-express-utils";
import {inject} from "inversify";
import * as fs from 'fs'
import * as multer from "multer";
import * as Busboy from "busboy";
import {AdminRepository} from "../domain/models/admin/AdminRepository";
import {DomainInterest} from "../domain/entities/DomainInterest";
import {TYPES} from "../domain/types";
import {DomainAdmin} from "../domain/entities/DomainAdmin";
import { InterestsRepository } from '../domain/models/interests/InterestsRepository';



@controller('/admin/interests')
export class InterestsController implements interfaces.Controller {
    constructor(@inject(TYPES.AdminRepository) private _adminRepository: AdminRepository){}

    @httpPost('/add-inner')
    private async addInterest(req: express.Request, res: express.Response){
        let name = req.body.name;
        let nameAR = req.body.nameAR;
        let adminId = req.body.adminId;
        let imageUrl = req.body.imageUrl;

        
        if (name && nameAR && adminId && imageUrl){
            let interest = new DomainInterest();
            interest.name = name;
            interest.created_by = new DomainAdmin();
            interest.nameAR = nameAR;
            interest.image_url = imageUrl;
            interest.created_by._id = adminId;

            await this._adminRepository.addInterest(adminId, interest)
                .then((r) => {
                    res.status(200).json({message: r, error: false});
                }).catch((err) => {
                    res.status(500).json({message: err, error: true});
                });
        } else {
            res.status(500).json({message: 'name, nameAR and adminId are required', error: true});
        }
    }

    //@httpPut('/upload')
    private uploadFile(req: express.Request, res: express.Response) {
        req.setTimeout(20000, () => {})
        //const busboy = new Busboy({ headers: req.headers });
        console.log('in')
        //req.pipe(busboy, {end: false})
        
        // busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {  
        //     file.on('data', data => {
        //         console.log('File [' + filename + '] got ' + data.length + ' bytes');
        //     });
        //     file.on('end', () => {
        //         console.log(mimetype) // image/jpeg -- image/png
        //         console.log('File[' + filename + '] finished');
        //     });
        //     if (mimetype === 'image/jpeg' || mimetype === 'image/png'){
        //         const writeStream = fs.createWriteStream('./src/images/interests/' + filename);
        //         file.pipe(writeStream);
        //     }
            
        // }).on('finish', () => {
        //     //req.pipe(busboy, {end: false})
        //     console.log('Done parsing');
        //     res.send({error: true})
        // });
    }
}