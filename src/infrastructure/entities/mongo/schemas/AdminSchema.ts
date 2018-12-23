import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'
import { BaseSchema } from '../../../interfaces/BaseSchema';
import { injectable } from 'inversify';
import {Admin} from "mongodb";

@injectable()
export class AdminSchema implements BaseSchema {

    public static _schema: Schema = new Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        accessToken: {
            type: Schema.Types.ObjectId,
        },
        password:{
            type: String,
            required: true
        },
        loggedIn:{
            type: Boolean,
            default: false
        },
        online: {
            type: Boolean,
            default: false
        },
        privileges: [{
            type: Schema.Types.ObjectId,
            ref: 'ControlPrivilege'
        }],
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);



    getModel(){
        return model('Admin', AdminSchema._schema);
    }
}