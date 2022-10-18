import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId;
  followeeId: Types.ObjectId;
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: User;
  followeeId: User;
}

// Mongoose schema definition for interfacing with a MongoDB table
// Follow relationships stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema({
  // The user's username
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The user's password
  followeeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});


const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
