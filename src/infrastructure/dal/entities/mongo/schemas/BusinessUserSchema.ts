import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from './BaseSchema';

@injectable()
export class BusinesUserSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        up_to: {
            type: Number,
            default: 1
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);;
    public _model;


    public getModel(){
        return model('BusinesUser', BusinesUserSchema._schema);
    }
}