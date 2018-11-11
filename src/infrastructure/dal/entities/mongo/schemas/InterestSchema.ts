import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from './BaseSchema';

@injectable()
export class InterestSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        created_by: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Admin'
        },
        I_url: {
            type: String,
            default: ''
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);
    public _model;


    public getModel(){
        return model('Interest', InterestSchema._schema);
    }
}