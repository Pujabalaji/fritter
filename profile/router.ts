import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProfileCollection from './collection';
import * as util from './util';
import * as userValidator from '../user/middleware';
import * as profileValidator from '../profile/middleware';

const router = express.Router();

/**
 * Get profiles by user.
 *
 * @name GET /api/profile?username=username
 *
 * @return {ProfileResponse[]} - An array of Profiles created by user with id, userId
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 *
 * 
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if authorId query parameter was supplied
        if (req.query.username !== undefined) {
            next();
            return;
        }
  
        const allProfiles = await ProfileCollection.findAll();
        const response = allProfiles.map(util.constructProfileResponse);
        res.status(200).json(response);
    },
    [
        userValidator.isQueryUsernameExists
    ],
    async (req: Request, res: Response) => {
        const userProfiles = await ProfileCollection.findAllByUsername(req.query.username as string);
        const response = userProfiles.map(util.constructProfileResponse);
        res.status(200).json(response);
    }
);

/**
 * Create a new profile.
 *
 * @name POST /api/profile
 *
 * @return {ProfileResponse} - The created profile
 * @throws {403} - If the user is not logged in
 */
 router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        profileValidator.isProfileNameNotAlreadyInUse
    ],
    async (req: Request, res: Response) => {
        console.log("In post router of Profile");
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        console.log("found userId for current user");
        const profile = await ProfileCollection.addOne(req.body.profileName, userId);
        console.log("Able to addOne()");
        
        res.status(201).json({
            message: 'Your profile was created successfully.',
            profile: util.constructProfileResponse(profile)
        });
    }
);
  
  /**
   * Delete a profile with profile name
   *
   * @name DELETE /api/profile/:profileName
   *
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in or is not the author of
   *                 the freet
   * @throws {404} - If the freetId is not valid
   */
  router.delete(
    '/:profileName?',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      await ProfileCollection.deleteOne(req.params.profileName);
      res.status(200).json({
        message: 'Your profile was deleted successfully.'
      });
    }
);

export {router as profileRouter};
