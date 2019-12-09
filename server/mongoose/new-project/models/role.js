import mongoose from 'mongoose';
import projectdb from '../new-projectdb';

const { Schema, ObjectId } = mongoose;

const roleSchema = new Schema({
  name: String,
  description: String,
  queries: [String],
  mutations: [String],
  subscriptions: [String],
  created: {
    type: Date,
    default: Date.now,
  },
}
  , { minimize: false });

const Role = projectdb.model('Role', roleSchema);
export default Role
