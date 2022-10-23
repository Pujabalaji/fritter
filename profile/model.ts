import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';


/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type Profile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  profileName: string;
  userId: Types.ObjectId;
  // liked_posts: Types.ObjectId;
  // bookmarked_posts: Types.ObjectId;
};

export type PopulatedProfile = {
    _id: Types.ObjectId;
    profileName: string;
    userId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ProfileSchema = new Schema<Profile>({
  // The profile name
  profileName: {
    type: String,
    required: true
  },
  // user this profile belongs to 
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const ProfileModel = model<Profile>('Profile', ProfileSchema);
export default ProfileModel;
