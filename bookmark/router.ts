import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProfileCollection from '../profile/collection';
import BookmarkCollection from './collection';
import * as util from './util';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as profileValidator from '../profile/middleware';
import * as bookmarkValidator from '../bookmark/middleware';

const router = express.Router();

export {router as bookmarkRouter};

/**
 * Get all the bookmarks
 *
 * @name GET /api/bookmark
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks
 */
/**
 * Get bookmarks by profileName.
 *
 * @name GET /api/bookmark?profileName=id
 *
 * @return {BookmarkResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If profileName is not given
 * @throws {404} - If current user does not have profileName
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if username (author) query parameter was supplied
      if (req.query.profileName !== undefined) {
        next();
        return;
      }
  
      const allBookmarks = await BookmarkCollection.findAll();
      const response = allBookmarks.map(util.constructBookmarkResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isUserLoggedIn,
      profileValidator.isQueryProfileNameExistsForCurrentUser
    ],
    async (req: Request, res: Response) => {
      const profileBookmarks = await BookmarkCollection.findAllByProfileNameAndUserId(req.query.profileName as string, req.session.userId as string);
      const response = profileBookmarks.map(util.constructBookmarkResponse);
      res.status(200).json(response);
    }
  );

  /**
 * Add a new bookmark.
 *
 * @name POST /api/bookmark
 *
 * @return {BookmarkResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If freetId not provided in body
 * @throws {404} - If freetId is not a valid freet
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      profileValidator.isBodyProfileNameExistsForCurrentUser,
      freetValidator.isFreetIdInBodyExists
    ],
    async (req: Request, res: Response) => {
      console.log("Making Bookmark POST Request in Router");
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      console.log("req.body.profileName" + req.body.profileName);
      const profile = await ProfileCollection.findOneByProfileNameAndUserId(req.body.profileName, userId);
      console.log("profile to add bookmark to " + profile.profileName);
      console.log(profile);
      const bookmark = await BookmarkCollection.addOne(req.body.freetId, profile._id);
      console.log("adding this freet to bookmarks: ");
      console.log(bookmark);
      res.status(201).json({
        message: 'Your bookmark was added to your ' + profile.profileName + ' profile successfully.',
        bookmark: util.constructBookmarkResponse(bookmark)
      });
    }
  );
  
  /**
   * Delete a bookmark
   *
   * @name DELETE /api/bookmark/:bookmarkId
   *
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in or is not the author of
   *                 the freet
   * @throws {404} - If the bookmark ID is not valid
   */
  router.delete(
    '/:bookmarkId?',
    [
      userValidator.isUserLoggedIn,
      bookmarkValidator.isBookmarkIdParamExists
    ],
    async (req: Request, res: Response) => {
      await BookmarkCollection.deleteOne(req.params.bookmarkId);
      res.status(200).json({
        message: 'Your bookmark was deleted successfully.'
      });
    }
  );
  