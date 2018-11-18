import {Schema, model} from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator'
import { BaseSchema } from './BaseSchema';
import { injectable } from 'inversify';

@injectable()
export class ItemSchema implements BaseSchema {

    public static _schema: Schema = new Schema({
        /*available - **not-available** - blocked - in-review - rejected - swapped*/
        /*
         * -available -> indicates user_item available for swapping
         * -in-review -> user_item goes in-review on **admin due to report or 1 week policy or**
         *      republish
         * -blocked -> user_item blocked by admin due report or 1 week period
         *       without requests or not accepting request
         *
         *       1- blocked for report
         *       2- blocked for 1 week policy without requests
         *       3- blocked for 1 week policy without accepting requests
         * -rejected -> rejected by admin after in-review state
         * -in-swapping -> after accepting request within 24 hours
         * -swapped -> user_item has been swapped
         * -processing -> user_item is in processing mode at that time
         * */
        status: {
            type: String,
            default: 'ongoing'
        },
        onWeekMilli: {
            type: Number,
            default: 604800000,
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true
        },
        i_urls: [{
            url: String
        }],
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }).plugin(uniqueValidator);



    getModel(){
        return model('Item', ItemSchema._schema);
    }
}