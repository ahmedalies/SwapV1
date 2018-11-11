import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { BaseSchema } from './BaseSchema';
import { injectable } from 'inversify';

@injectable()
export class MongoUserSchema implements BaseSchema {
    
    public static _schema: Schema = new Schema({
        name: {
            type: String,
            required: true
        },
        userType: { /*individual - business */
            type: String,
            default: 'individual'
        },
        status: {  /* ongoing - blocked for rate*/ 
            type: String,
            default: 'ongoing'
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        phone: {
            type: String,
            unique: true
        },
        avatar: {
            type: String,
            default: ''
        },
        points: {
            type: Number,
            default: 0
        },
        loggoedIn:{
            type: Boolean,
            default: false
        },
        online: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);
    


    getModel(){
        return model('User', MongoUserSchema._schema);
    }
}