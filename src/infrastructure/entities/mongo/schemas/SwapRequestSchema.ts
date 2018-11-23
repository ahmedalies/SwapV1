import {injectable} from "inversify";
import {BaseSchema} from "./BaseSchema";
import {model, Schema} from "mongoose";
import * as uniqueValidator from 'mongoose-unique-validator'

@injectable()
export class SwapRequestSchema implements BaseSchema {

    public static _schema: Schema = new Schema({
        /* ongoing - accepted - rejected - canceled- *system-sender* -*/
        /*
         * -ongoing -> swap request is sent to owner - no confirmation yet
         * -accepted -> swap request is accepted by owner
         * -rejected -> swap request is rejected by owner
         * -canceled-by-system -> all remain swap requests is canceled by system when needyUser's request to swap is accepted
         *              in one swap request
         * -canceled-by-sender -> cancel swap request due to sender cancel
         * */
        status: {
            type: String
        },
        sender_rate: {
            type: Number
        },
        receiver_rate: {
            type: Number
        },
        respond_at: {
            type: Number
        },
        milli24h: {
            type: Number
        },
        sender_item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        receiver_item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);


    getModel(){
        return model('SwapRequest', SwapRequestSchema._schema);
    }
}