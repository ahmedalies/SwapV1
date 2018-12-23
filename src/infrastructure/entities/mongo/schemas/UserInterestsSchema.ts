import {injectable} from "inversify";
import * as uniqueValidator from 'mongoose-unique-validator'
import {BaseSchema} from "../../../interfaces/BaseSchema";
import {model, Schema} from "mongoose";

@injectable()
export class UserInterestSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User'
        },
        interests: [{
            interest: {type: Schema.Types.ObjectId, ref: 'Interest'},
            created_at: {type: Date, default: Date.now()}
        }],

    }).plugin(uniqueValidator);
    public _model;


    public getModel(){
        return model('UserInterest', UserInterestSchema._schema);
    }
}