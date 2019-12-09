import mongoose from 'mongoose';
import projectdb from '../new-projectdb';

const { Schema } = mongoose;

const logSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    parentType: String,
    fieldName: String,
    user: String,
    details: String

}, { minimize: false });

const Log = projectdb.model('Log', logSchema);
export default Log
