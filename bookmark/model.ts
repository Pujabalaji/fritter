import { Freet } from '../freet/model';
import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Profile } from 'profile/model';

// Type definition for Bookmark on the backend
export type Bookmark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  profileId: Types.ObjectId;
  dateAdded: Date;
};

export type PopulatedBookmark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  profileId: Profile;
  dateAdded: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BookmarkSchema = new Schema<Bookmark>({
  // The author userId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  profileId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Profile'
  },
  dateAdded: {
    type: Date,
    required: true
  }
});

const BookmarkModel = model<Bookmark>('Bookmark', BookmarkSchema);
export default BookmarkModel;
