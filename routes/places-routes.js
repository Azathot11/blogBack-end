const { request } = require('express');
const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const isAuth = require('../middleware/is-auth')

const placesControllers = require('../controllers/places-controllers');

router.get('/place/:pid',placesControllers.getPlaceById);
router.get('/userplaces',isAuth,placesControllers.getUserPlaces);
router.get('/user/:uid',placesControllers.getPlaceByUserId);
router.post('/createPlace',[
    check('title').not().isEmpty(),
    check('description').not().isEmpty(),
    check('address').not().isEmpty(),
],isAuth,placesControllers.createPlace);
router.patch('/place/:pid',isAuth,[
    check('title').not().isEmpty(),
    check('description').not().isEmpty(),
    check('address').not().isEmpty(),
],placesControllers.updatePLaceById);
router.delete('/place/:pid',isAuth,placesControllers.deletePlace);

module.exports = router;