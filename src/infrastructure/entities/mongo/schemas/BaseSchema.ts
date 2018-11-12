import {Schema, model} from 'mongoose';    
import { injectable } from 'inversify';


export interface BaseSchema {
    getModel(): any;
}