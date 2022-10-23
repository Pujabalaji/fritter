import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  following: Array<Types.ObjectId>;
  profiles: Array<Types.ObjectId>;
  privateLike: Boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // user allows private like
  privateLike: {
    type: Boolean,
    required: true
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

// virtual population
// Auto-populate User.following with any Follow relationships associated with this User such that User._id === Follow.follower._id
UserSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followerId'
})

// Auto-populate User.profiles with any Profile instances tied to this account
UserSchema.virtual('profiles', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'account_id'
})

const UserModel = model<User>('User', UserSchema);
export default UserModel;
