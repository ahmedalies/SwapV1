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
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const types_1 = require("../domain/types");
const DomainAdmin_1 = require("../domain/entities/DomainAdmin");
let AdminController = class AdminController {
    constructor(_repository) {
        this._repository = _repository;
    }
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const password = req.body.password;
            const creatorId = req.body.creatorId;
            if (username && password && creatorId) {
                let admin = new DomainAdmin_1.DomainAdmin();
                admin.username = username;
                admin.password = password;
                yield this._repository.createAdmin(creatorId, admin)
                    .then((r) => {
                    res.status(200).send({ admin: r, error: false });
                }).catch((err) => {
                    res.status(200).send({ message: err, error: true });
                });
            }
            else {
                res.status(200).send({ message: 'username and password are required fields', error: true });
            }
        });
    }
};
__decorate([
    inversify_express_utils_1.httpPost('/create'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdmin", null);
AdminController = __decorate([
    inversify_express_utils_1.controller('/admin'),
    __param(0, inversify_1.inject(types_1.TYPES.AdminRepository)),
    __metadata("design:paramtypes", [Object])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map