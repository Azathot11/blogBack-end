const Place = require("../models/place");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const mongoose = require("mongoose");
const User = require("../models/user");
const { findByIdAndRemove } = require("../models/place");

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      throw new HttpError("Could not find a place for the provided id.", 404);
    }

    res.status(200).json({ place });
  } catch (err) {
    const error = new HttpError("Could not find place", 500);
    return next(error);
  }

  // => { place } => { place: place }
};

exports.getUserPlaces = async (req, res, next) => {
  const userId = req.userId;
  // console.log(userId)

  try {
    const place = await Place.find({
      creator: mongoose.Types.ObjectId(userId),
    });
    // console.log(place);
    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided user id.", 404)
      );
    }

    res.status(200).json({ place });
  } catch (err) {
    const error = new HttpError("Could not find place", 500);
    return next(error);
  }
};
exports.getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // console.log(userId)

  try {
    const place = await Place.find({
      creator: mongoose.Types.ObjectId(userId),
    });
    // console.log(place);
    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided user id.", 404)
      );
    }

    res.status(200).json({ place });
  } catch (err) {
    const error = new HttpError("Could not find place", 500);
    return next(error);
  }
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  const userId = req.userId;

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Input passed please check your data.", 422)
    );
  }
  const { title, description, address, creator } = req.body;
  // console.log(req.userId)
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
    const place = new Place({
      title,
      description,
      location: coordinates,
      address,
      creator: req.userId,
      image:
        "https://media.cntraveler.com/photos/61eae294c43ef397991bf238/master/w_1920%2Cc_limit/British%2520Virgin%2520Islands_GettyImages-973996210.jpg",
    });
    const result = await place.save();

    const user = await User.findById(userId);
    // console.log(user,'user');

    user.places.push(result._id.toString());

    user.save();
    //  console.log(user);
    res.status(201).json({ result, user });
  } catch (err) {
    const error = new HttpError("Could not create place", 500);
    return next(error);
  }
};

exports.updatePLaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Input passed please check your data.", 422)
    );
  }
  const placeId = req.params.pid;
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
    const place = await Place.findById(placeId);

    if (!place || place.length === 0) {
      return next(
        new HttpError("Could not find a place for the provided place id.", 404)
      );
    }
    place.title = title;
    place.description = description;
    place.address = address;
    place.location = coordinates;
    place.image =
      "https://media.cntraveler.com/photos/61eae294c43ef397991bf238/master/w_1920%2Cc_limit/British%2520Virgin%2520Islands_GettyImages-973996210.jpg";

    await place.save();
    console.log(place)
    res.status(200).json({ place });
  } catch (err) {
    const error = new HttpError("Could not find place", 500);
    return next(error);
  }

  // const updatePlace = { ...DUMMY_PLACES.find((place) => place.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  // updatePlace.title = title;
  // updatePlace.description = description;

  // DUMMY_PLACES[placeIndex] = updatePlace;

  // if (!updatePlace) {
  //   throw next(
  //     new HttpError("Could not find a place for the provided place id.", 404)
  //   );
  // }

  // res.status(200).json({ DUMMY_PLACES });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const userId = req.userId;
  //63200721b734a61e487680e4 orrange

  //63200733b734a61e487680e9 mtn
  
  console.log(placeId)

  try {
    const place = await Place.findOne({
      placeId,
      creator: mongoose.Types.ObjectId(userId),
    });

    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided place id.", 404)
      );
    }

    await Place.findByIdAndRemove(placeId);
  

    const user = await User.findById(userId);
   console.log(user)
    const newArrayOfId =  user.places.filter((id) => id.toString() !== placeId);
    user.places = newArrayOfId;
    console.log(newArrayOfId)
    user.save();
   
    res.status(200).json({ message: "deleted with success" });
  } catch (err) {
    const error = new HttpError("Something went wrong could not delete", 500);

    console.log(err)
    return next(error);
  }
};
