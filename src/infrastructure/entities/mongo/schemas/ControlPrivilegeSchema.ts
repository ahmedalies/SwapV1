import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from './BaseSchema';

//holds all system functions
@injectable()
export class ControlPrivilegeSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        f_name: {
            type: String,
            required: true,
            unique: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);
    public _model;


    public getModel(){
        return model('ControlPrivilege', ControlPrivilegeSchema._schema);
    }
}