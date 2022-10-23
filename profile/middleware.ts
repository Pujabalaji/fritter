import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from 'user/collection';
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
  
export {
    isProfileNameNotAlreadyInUse
};
  
  
