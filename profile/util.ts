import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile, PopulatedProfile} from './model';

// Update this if you add a property to the User type!
type ProfileResponse = {
    _id: string;
    profileName: string;
    username: string;
  };

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Profile>} profile - A profile object
 * @returns {ProfileResponse} - The prfile object
 */
const constructProfileResponse = (profile: HydratedDocument<Profile>): ProfileResponse => {
  const profileCopy: PopulatedProfile = {
    ...profile.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = profileCopy.userId;
  delete profileCopy.userId;
  return {
    ...profileCopy,
    _id: profileCopy._id.toString(),
    profileName: profileCopy.profileName,
    username: username
  };
};

export {
  constructProfileResponse
};

