import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { injectable } from 'inversify';
import { BaseSchema } from '../../../interfaces/BaseSchema';

@injectable()
export class ConfigurationCreationSchema implements BaseSchema {
    public static _schema: Schema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        is_created: {
            type: Boolean,
            default: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);;
    public _model;


    public getModel(){
        return model('ConfigurationCreation', ConfigurationCreationSchema._schema);
    }
}
