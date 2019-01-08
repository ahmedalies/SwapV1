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
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const types_1 = require("../domain/types");
const SwapRequestService_1 = require("../domain/services/SwapRequestService");
let SwapRequestContoller = class SwapRequestContoller {
    constructor(service) {
        this.service = service;
    }
    askSwap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.askForSwap(req.body, req.headers)
                .then((r) => {
                if (r.message) {
                    res.status(200).send({ message: r.message, request: r, error: true });
                }
                else {
                    res.status(200).send({ request: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
    acceptSwap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.accept(req.body, req.headers)
                .then((r) => {
                if (r) {
                    res.status(200).send({ message: r, error: true });
                }
                else {
                    res.status(200).send({ request: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
    rejectSwap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.rejectSwap(req.body, req.headers)
                .then((r) => {
                if (r) {
                    res.status(200).send({ message: r, error: true });
                }
                else {
                    res.status(200).send({ request: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
    getRunning(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.getRunning(req.body, req.headers)
                .then((r) => {
                if (r) {
                    res.status(200).send({ requests: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
    getAccepted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.getAccepted(req.body, req.headers)
                .then((r) => {
                if (r) {
                    res.status(200).send({ requests: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
    getRejected(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.getRejected(req.body, req.headers)
                .then((r) => {
                if (r) {
                    res.status(200).send({ requests: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
    getOneSwap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.getOneSwap(req.params, req.headers)
                .then((r) => {
                if (r) {
                    res.status(200).send({ request: r, error: false });
                }
            }).catch((err) => {
                res.status(200).send({ message: err, error: true });
            });
        });
    }
};
__decorate([
    inversify_express_utils_1.httpPost('/ask'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "askSwap", null);
__decorate([
    inversify_express_utils_1.httpPost('/accept'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "acceptSwap", null);
__decorate([
    inversify_express_utils_1.httpPost('/reject'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "rejectSwap", null);
__decorate([
    inversify_express_utils_1.httpGet('/running'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "getRunning", null);
__decorate([
    inversify_express_utils_1.httpGet('/accepted'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "getAccepted", null);
__decorate([
    inversify_express_utils_1.httpGet('/rejected'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "getRejected", null);
__decorate([
    inversify_express_utils_1.httpGet('/:requestId'),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SwapRequestContoller.prototype, "getOneSwap", null);
SwapRequestContoller = __decorate([
    inversify_express_utils_1.controller('/user/request'),
    __param(0, inversify_1.inject(types_1.TYPES.SwapRequestService)),
    __metadata("design:paramtypes", [SwapRequestService_1.SwapRequestService])
], SwapRequestContoller);
exports.SwapRequestContoller = SwapRequestContoller;
//# sourceMappingURL=SwapRequestContoller.js.map