"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const DomainInterest_1 = require("../domain/entities/DomainInterest");
const types_1 = require("../domain/types");
const DomainAdmin_1 = require("../domain/entities/DomainAdmin");
let InterestsController = class InterestsController {
    constructor(_adminRepository) {
        this._adminRepository = _adminRepository;
    }
    addInterest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = req.body.name;
            let nameAR = req.body.nameAR;
            let adminId = req.body.adminId;
            let imageUrl = req.body.imageUrl;
            if (name && nameAR && adminId && imageUrl) {
                let interest = new DomainInterest_1.DomainInterest();
                interest.name = name;
                interest.created_by = new DomainAdmin_1.DomainAdmin();
                interest.nameAR = nameAR;
                interest.image_url = imageUrl;
                interest.created_by._id = adminId;
                yield this._adminRepository.addInterest(adminId, interest)
                    .then((r) => {
                    res.status(200).json({ message: r, error: false });
                }).catch((err) => {
                    res.status(500).json({ message: err, error: true });
                });
            }
            else {
                res.status(500).json({ message: 'name, nameAR and adminId are required', error: true });
            }
        });
    }
    //@httpPut('/upload')
    uploadFile(req, res) {
        req.setTimeout(20000, () => { });
        //const busboy = new Busboy({ headers: req.headers });
        console.log('in');
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
};
__decorate([
    inversify_express_utils_1.httpPost('/add-inner'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InterestsController.prototype, "addInterest", null);
InterestsController = __decorate([
    inversify_express_utils_1.controller('/admin/interests'),
    __param(0, inversify_1.inject(types_1.TYPES.AdminRepository)),
    __metadata("design:paramtypes", [Object])
], InterestsController);
exports.InterestsController = InterestsController;
//# sourceMappingURL=InterestsController.js.map