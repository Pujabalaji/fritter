import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookmarkCollection from './collection';

/**
 * Checks if bookmarkId provided in parameter is a valid bookmark
 */
const isBookmarkIdParamExists = async(req: Request, res: Response, next: NextFunction) => {
    const bookmark = await BookmarkCollection.findOne(req.params.bookmarkId);
    if (!bookmark) {
        res.status(404).json({
          error: {
            freetNotFound: `Bookmark with bookmark ID ${req.params.bookmarkId} does not exist.`
          }
        });
        return;
      }
    
      next();
};

/**
 * Checks if keyword in req.query exists
 */
 const isQueryKeywordExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.keyword) {
      res.status(400).json({
        error: 'When searching, keyword query must be nonempty.'
      });
      return;
    }
    next();
};


export {
    isBookmarkIdParamExists,
    isQueryKeywordExists
};