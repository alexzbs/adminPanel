import mongoose from 'mongoose';
import projectdb from '../new-projectdb';
require('dotenv').config()

const { Schema, ObjectId } = mongoose;

 const userSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    surname: {
        type: String,
        default: ''
    },
    email: String,
    password: String,
    role: {
        type: ObjectId,
        ref: 'Role',
        default: process.env.GUEST_ROLE
    }
}, { minimize: false });

const User = projectdb.model('User', userSchema);
export default User
