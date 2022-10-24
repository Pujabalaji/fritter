import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import type {Freet} from '../freet/model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import FreetModel from '../freet/model';

/**
* This file contains a class with functionality to interact with users stored
* in MongoDB, including adding, finding, updating, and deleting. Feel free to add
* additional operations in this file.
*
* Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
* and contains all the information in User. https://mongoosejs.com/docs/typescript.html
*/
class FollowCollection {
    /**
     * Add a new follow relationship
     *
     * @param {string} follower - The user who chooses to follow another user
     * @param {string} followee - The user who is followed / monitored by follower
     * @return {Promise<HydratedDocument<Follow>>} - The newly created follow relationship
     */
    static async addOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const follow = new FollowModel({followerId, followeeId});
        await follow.save(); // Saves user to MongoDB
        return follow.populate(['followerId', 'followeeId']);
    }

    /**
     * Find a follow by followId
     *
     * @param {string} followId - The id of the Follow relationship to find
     * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow with the given followId, if any
     */
    static async findOne(followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        return FollowModel.findOne({_id: followId}).populate(['followerId', 'followeeId']);
    }

  /**
   * Get all the followings where given username is the follower.
   *
   * @param {string} username - The username of the follower
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the following
   */
  static async findAllFolloweesByUsername(username:string): Promise<Array<HydratedDocument<Follow>>> {
    const follower = await UserCollection.findOneByUsername(username); // get the user id of follower
    return FollowModel.find({followerId: follower._id}).populate(['followerId', 'followeeId']);
  }

  /**
   * Get all the followings by given username is the followee.
   *
   * @param {string} username - The username of the followee
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the following
   */
   static async findAllFollowersByUsername(username:string): Promise<Array<HydratedDocument<Follow>>> {
    const followee = await UserCollection.findOneByUsername(username); // get the user id of follower
    return FollowModel.find({followeeId: followee._id}).populate(['followerId', 'followeeId']);
  }

  /**
   * Get all the freets by the user's given username follows.
   * This means username is the follower.
   *
   * @param {string} username - The username of the follower
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the following
   */
   static async findAllFollowersFreetsByUsername(username:string): Promise<Array<HydratedDocument<Freet>>> {
    const follower = await UserCollection.findOneByUsername(username); // get the user id of follower
    const follows = await FollowCollection.findAllFolloweesByUsername(follower.username);
    const followeesIds = follows.map(follow => follow.followeeId._id);
    console.log("followeesIds");
    console.log(followeesIds);
    return FreetModel.find({authorId: {$in: followeesIds}}).populate('authorId'); 
  }

  /**
   * Delete one with given followId
   *
   * @param {string} followId - The followId of follow relationship to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
   static async deleteOne(followerId: Types.ObjectId | string, followeeUsername: string): Promise<boolean> {
    const followeeId = (await UserCollection.findOneByUsername(followeeUsername))._id
    const follow = await FollowModel.deleteOne({followerId: followerId, followeeId: followeeId});
    return follow !== null;
  }
}

export default FollowCollection;