import { UserSchema, UserModel } from "../entities/mongo/schemas/UserSchema";
import { injectable } from "../../../../node_modules/inversify";

@injectable()
export class ORMRepository<DALEntity> {
    login(email: string, password: string): Promise<DALEntity> {
        let p = new Promise<DALEntity>((resolve, reject) => {
            
            UserModel.findOne({email: email, password: password})
            .exec((err, res:DALEntity) => {
                if(err) reject(err);
                else if (res) resolve(res);
                else resolve(null);
            });
        });

        return p;
    }
}