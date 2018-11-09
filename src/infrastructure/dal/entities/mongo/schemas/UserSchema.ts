import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'     



export let UserSchema: Schema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now()
    }
}).plugin(uniqueValidator);

export let UserModel = model('User', UserSchema);