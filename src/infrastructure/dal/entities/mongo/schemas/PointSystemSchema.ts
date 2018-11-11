import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from './BaseSchema';

@injectable()
export class PointSystemSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        t_ref: {
            type: String,
            required: true,
            unique: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);;
    public _model;


    public getModel(){
        return model('PointSystem', PointSystemSchema._schema);
    }
}
