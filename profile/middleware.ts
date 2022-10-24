import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ProfileCollection from '../profile/collection';

/**
 * Checks if a profile name in req.body is already in use
 */
 const isProfileNameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
    const profile = await ProfileCollection.findOneByProfileNameAndUserId(req.body.profileName, req.session.userId as string);
    
    if (!profile) {
      next();
      return;
    }
  
    res.status(409).json({
      error: {
        username: 'Profile with this name already exists for this user.'
      }
    });
};

/**
 * Check if current user has a profile with profileName provided in req.query
 */
const isParamsProfileNameExistsForCurrentUser = async(req: Request, res: Response, next: NextFunction) => {
  const profileName = req.params.profileName;
  if (!profileName) {
    res.status(400).json({error: "Missing profileName in request"});
  }
  
  console.log("profileName" + profileName);
  const profile = await ProfileCollection.findOneByProfileNameAndUserId(profileName as string, req.session.userId as string);
  
  if (!profile) {
    next()
  } else {
    res.status(404).json({error: "The profile name provided does not exist"});
  }
};

/**
 * Check if current user has a profile with profileName provided in req.body
 */
 const isBodyProfileNameExistsForCurrentUser = async(req: Request, res: Response, next: NextFunction) => {
  const profileName = req.body.profileName;
  if (!profileName) {
    res.status(400).json({error: "Missing profileName in request"});
  }
  
  const profile = await ProfileCollection.findOneByProfileNameAndUserId(profileName as string, req.session.userId as string);
  
  if (profile) {
    next();
  } else {
    res.status(404).json({error: "The profile name provided does not exist"});
  }
  return;
};
  
export {
    isProfileNameNotAlreadyInUse,
    isParamsProfileNameExistsForCurrentUser,
    isBodyProfileNameExistsForCurrentUser
};
  
  
