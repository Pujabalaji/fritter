import {Request, Response, NextFunction, request} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';

/**
 * Checks if followerId is given and if followerId is a valid user
 */
const isFollowerExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username) {
    console.log("inside isFollower exists")
    res.status(400).json({
      error: 'Must provide a nonempty username to follow.'
    });
    return;
  }

  const queriedUser = await UserCollection.findOneByUsername(req.query.username as string);
  // const queriedUserId = queriedUser._id
  if (!queriedUser) {
    res.status(404).json({
      error: `A user with username ${req.query.username as string} does not exist.`
    });
    return;
  }
  next();
};

/**
 * Checks if user is trying to follow self. Following yourself is not allowed.
 */
const isUserFollowingSelf = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId((req.session.userId as string));
  const currentUsername = user.username;
  if ((req.query.username as string) === currentUsername) {
    res.status(400).json({
      error: 'Sorry, cannot follow yourself.'
    });
    return;
  }
  next()
};

export {
  isFollowerExists,
  isUserFollowingSelf
};