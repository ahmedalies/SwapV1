import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from '../../../interfaces/BaseSchema';

@injectable()
export class PointLogSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        u_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        sub_p_ref: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'SubPointSystem'
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);;
    public _model;


    public getModel(){
        return model('PointLog', PointLogSchema._schema);
    }
}
