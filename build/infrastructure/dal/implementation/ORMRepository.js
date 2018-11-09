"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSchema_1 = require("../entities/mongo/schemas/UserSchema");
const inversify_1 = require("../../../../node_modules/inversify");
let ORMRepository = class ORMRepository {
    login(email, password) {
        let p = new Promise((resolve, reject) => {
            UserSchema_1.UserModel.findOne({ email: email, password: password })
                .exec((err, res) => {
                if (err)
                    reject(err);
                else if (res)
                    resolve(res);
                else
                    resolve(null);
            });
        });
        return p;
    }
    createUser(data) {
        let p = new Promise((resolve, reject) => {
            let user = new UserSchema_1.UserModel(data);
            user.save()
                .then(() => {
                resolve(data);
            })
                .catch((err) => {
                if (err)
                    reject(err);
            });
        });
        return p;
    }
};
ORMRepository = __decorate([
    inversify_1.injectable()
], ORMRepository);
exports.ORMRepository = ORMRepository;
//# sourceMappingURL=ORMRepository.js.map