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
const inversify_1 = require("../../node_modules/inversify");
const types_1 = require("../domain/types");
let AuthController = class AuthController {
    constructor(_repositry) {
        this._repositry = _repositry;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.email, req.body.password) {
                    const user = yield this._repositry.login(req.body.email, req.body.password);
                    res.status(200).send({ user: user, error: false });
                }
                else {
                    res.status(200).send({ message: 'email and password field are required', error: true });
                }
            }
            catch (error) {
                res.status(200).send({ user: error, error: true });
            }
        });
    }
};
__decorate([
    inversify_express_utils_1.httpPost('/login'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = __decorate([
    inversify_express_utils_1.controller('/user/auth'),
    __param(0, inversify_1.inject(types_1.TYPES.AuthRepository)),
    __metadata("design:paramtypes", [Object])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map