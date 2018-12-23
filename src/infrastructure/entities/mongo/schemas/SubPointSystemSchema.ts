import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from '../../../interfaces/BaseSchema';

@injectable()
export class SubPointSystemSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        p_ref: {
            type: Schema.Types.ObjectId,
            ref: 'PointSystem',
            required: true
        },
        f_name: {
            type: String,
            required: true,
            unique: true
        },
        value: {
            type: Number,
            default: 0
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);;
    public _model;


    public getModel(){
        return model('SubPointSystem', SubPointSystemSchema._schema);
    }
}
