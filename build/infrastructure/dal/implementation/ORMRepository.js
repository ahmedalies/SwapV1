"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let ORMRepository = class ORMRepository {
    findByTwoKeys(k1, k2, v1, v2, model) {
        console.log(model);
        let p = new Promise((resolve, reject) => {
            model.getModel().findOne({ k1: v1, k2: v2 })
                .then((res) => {
                if (res)
                    resolve(res);
                else
                    reject('document not found');
            }).
                catch((err) => {
                if (err)
                    reject(err);
            });
        });
        return p;
    }
    insert(data, model) {
        let p = new Promise((resolve, reject) => {
            let doc = model.getModel()(data);
            doc.save()
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
//# sourceMappingURL=MongoORMRepository.js.map