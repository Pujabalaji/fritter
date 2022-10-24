import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import { constructFreetResponse } from '../freet/util';

const router = express.Router();

/**
 * Get the freets of the users who username follows. Username is the follower.
 * Enables feed functionality, where feed is defined as freets of users a user follows.
 * 
 * @name GET /api/follow/feed?username
 *
 * @params {string} username - get the users who follow this username
 * @return {FreetResponse[]} - An array of users followed by followerId
 * @throws {400} - If followerId is not given
 *
 */
 router.get(
  '/feed',
  [
    // userValidator.isQueryUsernameExists
  ],
  async (req: Request, res: Response) => {
    const freets = await FollowCollection.findAllFollowersFreetsByUsername(req.query.username as string);
    const response = freets.map(constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Get users that username is following. This username is the follower.
 *
 * @name GET /api/follow/followees/:username
 * 
 * @param {string} username - find users this username is following
 * @return {FollowResponse[]} - An array of users followed by followerId
 * @throws {400} - 
 */
 router.get(
    '/followees/:username?',
    [
      userValidator.isParameterUsernameExists
    ],
    async (req: Request, res: Response) => {
      const followees = await FollowCollection.findAllFolloweesByUsername(req.params.username as string);
      const response = followees.map(util.constructFolloweeResponse);
      res.status(200).json(response);
    }
  );

  /**
 * Get users who follow username. Username is the followee.
 *
 * @name GET /api/follow/followers/:username
 *
 * @params {string} username - get the users who follow this username
 * @return {FollowResponse[]} - An array of users followed by followerId
 * @throws {400} - If followerId is not given
 *
 */
 router.get(
  '/followers/:username?',
  [
    userValidator.isParameterUsernameExists
  ],
  async (req: Request, res: Response) => {
      const followees = await FollowCollection.findAllFollowersByUsername(req.params.username as string);
      const response = followees.map(util.constructFollowerResponse);
      res.status(200).json(response);
  }
);

/**
 * Follow a user.
 *
 * @name POST /api/follow/?username=username
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {400} - If two users are not provided or follower is also the followee
 */
 router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowerExists,
    followValidator.isUserFollowingSelf
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const followee = await UserCollection.findOneByUsername(req.query.username as string);
    await FollowCollection.addOne(userId, followee._id);

    res.status(200).json({
      message: 'You successfully followed ' + followee.username + "!",
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/follow/?username=username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If there is no follow between current user and username 
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowerExists
  ],
  async (req: Request, res: Response) => {
    const currUser = (req.session.userId as string) ?? '';
    const followerUsername = (req.query.username);
    await FollowCollection.deleteOne(currUser, followerUsername as string);
    res.status(200).json({
      message: 'Your follow was deleted successfully.'
    });
  }
);
  
export {router as followRouter};