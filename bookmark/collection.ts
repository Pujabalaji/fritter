import type {HydratedDocument, Types} from 'mongoose';
import { Bookmark } from './model';
import BookmarkModel from './model';
import ProfileCollection from '../profile/collection';


class BookmarkCollection {
    /**
   * Add a bookmark to the collection
   *
   * @param {string} freetId - The id of the freet to bookmark
   * @param {string} profileId - The id of the profile to save the bookmark to
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(freetId: Types.ObjectId | string, profileId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const date = new Date();
    const bookmark = new BookmarkModel({
      freetId,
            profileId,
      dateAdded: date
    });
    await bookmark.save(); // Saves freet to MongoDB
    return await (await bookmark.populate('freetId')).populate('profileId');
  }

  /**
   * Find a bookmark by bookmarkId
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
   static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({_id: bookmarkId}).populate('freetId').populate('profileId');
  }

    /**
   * Get all the bookmarks in the database
   *
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the freets
   */
     static async findAll(): Promise<Array<HydratedDocument<Bookmark>>> {
        // Retrieves bookmarks and sorts them from most to least recent
        return BookmarkModel.find({}).sort({dateAdded: -1}).populate('freetId').populate('profileId');
      }

  /**
   * Get all the bookmarks by given profile
   *
   * @param {string} profileName - The profileName of the profile that saved the tweet
   * @param {string} userId - the id of the user that has profileName
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
   static async findAllByProfileNameAndUserId(profileName: string, userId: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const profile = await ProfileCollection.findOneByProfileNameAndUserId(profileName, userId);
    return BookmarkModel.find({profileId: profile._id}).populate('freetId').populate('profileId');
  }

  /**
   * Delete a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The id of the bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
   static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const freet = await BookmarkModel.deleteOne({_id: bookmarkId});
    return freet !== null;
  }

  /**
   * Delete all the bookmarks by the profile and user
   *
   * @param {string} profileId - The id of profile bookmarks are saved to
   */
   static async deleteManyByProfileId(profileId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({profileId});
  }

  /**
   * Delete all the bookmarks containing given freetId
   * 
   * @param {string} freetId - The id of the freet bookmarked
   */
   static async deleteManyByFreetId(freetId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({freetId});
  }
}

export default BookmarkCollection;