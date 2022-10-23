import { freetRouter } from 'freet/router';
import {HydratedDocument, Model, Types} from 'mongoose';
import type {Profile} from './model';
import ProfileModel from './model';
import UserCollection from '../user/collection';

class ProfileCollection {

    /**
     * 
     * @param profileName name of profile to add
     * @param userId the id of user under which this profile belongs to
     */
    static async addOne(profileName: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Profile>> {
        const profile = new ProfileModel({
            profileName,
            userId
        });
        await profile.save();
        return profile.populate('userId');
    }

    /**
   * Get all the profiles in the database
   *
   * @return {Promise<HydratedDocument<Profile>[]>} - An array of all of the profiles
   */
    static async findAll(): Promise<Array<HydratedDocument<Profile>>> {
        // Retrieves freets and sorts them from most to least recent
        return ProfileModel.find({}).sort({dateModified: -1}).populate('userId');
    }

    /**
   * Get all the profile of given user
   *
   * @param {string} username - the username
   * @return {Promise<HydratedDocument<Profile>[]>} - An array of all of the profiles
   */
    static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Profile>>> {
        const user = await UserCollection.findOneByUsername(username);
        return ProfileModel.find({userId: user._id}).populate('userId');
    } 

    /**
   * Find a profile by profileName (case insensitive).
   *
   * @param {string} profileName - The profile name of the user to find
   * @return {Promise<HydratedDocument<Profile>> | Promise<null>} - The profile with the given profileName, if any
   */
    static async findOneByProfileName(profileName: string): Promise<HydratedDocument<Profile>> {
        console.log("profileName in findOneByProfileName" + profileName);
        return ProfileModel.findOne({profileName: new RegExp(`^${profileName.trim()}$`, 'i')});
    }
    
    /**
     * Finding Profile given profile name and user id.
     *
     * @param {string} profileName - The username of the user to find
     * @param {string} userId - the userId of
     * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
     */
    static async findOneByProfileNameAndUserId(profileName: string, userId: string): Promise<HydratedDocument<Profile>> {
        return ProfileModel.findOne({
        profileName: new RegExp(`^${profileName.trim()}$`, 'i'),
        userId: userId
        });
    }

    /**
     * Find a profile by profileId.
     *
     * @param {string} profileId - The profileId of the profile to find
     * @return {Promise<HydratedDocument<Profile>> | Promise<null>} - The profile with the given profile name, if any
     */
    static async findOneByProfileId(userId: Types.ObjectId | string): Promise<HydratedDocument<Profile>> {
        return ProfileModel.findOne({_id: userId});
    }

    /**
     * Delete a profile with given profile name
     *
     * @param {string} profileName - The profileName of profile to delete
     * @return {Promise<Boolean>} - true if the profile has been deleted, false otherwise
     */
    static async deleteOne(profileName: string): Promise<boolean> {
        const profile = await ProfileCollection.findOneByProfileName(profileName);
        console.log("found this profile");
        console.log(profile._id);
        const deletedProfile = await ProfileModel.deleteOne({_id: profile._id});
        return deletedProfile !== null;
    }

    /**
   * Delete all the profiles beloging to given user.
   *
   * @param {string} userId - The id of user with profiles
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await ProfileModel.deleteMany({userId});
  }
}

export default ProfileCollection;