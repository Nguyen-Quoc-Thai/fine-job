const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const CVValidation = require('../../validations/cv.validation');
const CVController = require('../../controllers/cv.controller');

const router = express.Router();

router
  .route('/:userId')
  .post(auth('getUser'), validate(CVValidation.createCV), CVController.createCV)
  
router 
  .route('/')
  .get(auth('getAllCV'), validate(CVValidation.getAllUserCV), CVController.getUserCV);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: cvs
 *   description: CV for candidates are likely to apply jobs.
 */

/**
 * @swagger
 * /cvs/{userid}:
 *   post:
 *     summary: Create a CV
 *     description: candidates, employer can create a CV.
 *     tags: [cvs]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: title of CV
 *               baseInfo:
 *                 type: object
 *                 description: BaseInfor of a user, including the information of a user. Detail at file model.
 *               contact:
 *                  type: object
 *                  description: contact information of a user, such as phone, email, facebook,..
 *               about: 
 *                  type: string
 *                  description: information about yourself  
 *               featured:
 *                 type: array
 *                 description: Cai nay t k biet no la gi
 *               experiences:
 *                 type: array
 *                 description: the experience of a user
 *               education:
 *                  type: array
 *                  items:
 *                     type: string
 *                  description: the education of a user
 *               licenseAndCert:
 *                  type: array
 *                  description: the licenseAndCert of a user
 *               volunteer:
 *                  type: array
 *                  items:
 *                     type: string
 *                  description: the volunteer of a user
 *               skills:
 *                  type: string  
 *                  description: the volunteer of a user
 *             example:
 *               title: Toeic 990000000000000000000000
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/** 
 * @swagger
 * /cvs/?userId={userid}&cvId={cvid}:
 *   get:
 *     summary: get all CV of a user or get a cv of user by cvId
 *     description: Candidates, employer and admin can get all CV of user.
 *     tags: [cvs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *       - in: path
 *         name: cvid
 *         allowEmptyValue: true
 *         schema:
 *           type: string
 *         description: cv id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
*/


/**
 * @swagger
 * /cvs/{cvid}:
 *   get:
 *     summary: Get ONE CV of a user by CV_ID
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [cvs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cvid
 *         required: true
 *         schema:
 *           type: string
 *         description: CV id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a CV
 *     description: Logged in users can only update their own CV information. Only admins can update other users.
 *     tags: [cvs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                  type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               phone:
 *                  type: string
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               firstName: Anh Thai code xuyen dem
 *               lastName: Nang tam the he viet
 *               phone: "696969696"
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a CV
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [cvs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
