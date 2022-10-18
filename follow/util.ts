import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow, PopulatedFollow} from '../follow/model';
import UserCollection from 'user/collection';

// Update this if you add a property to the Follow type!
type FollowResponse = {
  _id: string;
  username: string; // username of following or followers
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFolloweeResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const user = followCopy.followeeId // followeeId is a User in Populated Follow
  return {
    _id: user._id.toString(),
    username: user.username
  };
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
 const constructFollowerResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const user = followCopy.followerId // followerId is a User in Populated Follow
  return {
    _id: user._id.toString(),
    username: user.username
  };
};

export {
  constructFolloweeResponse,
  constructFollowerResponse
};