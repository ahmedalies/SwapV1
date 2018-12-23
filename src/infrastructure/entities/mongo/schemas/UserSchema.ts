import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     
import { BaseSchema } from '../../../interfaces/BaseSchema';
import { injectable } from 'inversify';

@injectable()
export class UserSchema implements BaseSchema {
    
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
        accessToken: {
            type: Schema.Types.ObjectId,
        },
        points: {
            type: Number,
            default: 0
        },
        loggedIn:{
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
        return model('User', UserSchema._schema);
    }
}