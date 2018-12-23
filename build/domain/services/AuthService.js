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
const types_1 = require("../types");
const DomainUser_1 = require("../entities/DomainUser");
let AuthService = class AuthService {
    constructor(repository) {
        this.repository = repository;
    }
    register(userDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const name = userDate.name;
                const email = userDate.email;
                const password = userDate.password;
                const phone = userDate.phone;
                const gender = userDate.gender;
                const lang = userDate.lang;
                if (email && name && password && phone && gender && lang) {
                    let data = new DomainUser_1.DomainUser();
                    data.name = name;
                    data.email = email;
                    data.password = password;
                    data.phone = phone;
                    data.gender = gender;
                    data.lang = lang;
                    this.repository.register(data)
                        .then((user) => {
                        resolve(user);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject('name, email, password, phone adn gender fields are required');
                }
            });
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (data.email && data.password) {
                    this.repository.login(data.email, data.password)
                        .then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject('email and password fields are required');
                }
            });
        });
    }
};
AuthService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.AuthRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map