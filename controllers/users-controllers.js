const User = require('../models/user');

const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const uuid = require("uuid").v4;

const DUMMY_USERS = [
  {
    id: "1",
    name: "paul",
    email: "paul@gmail.com",
    password: "1234567",
  },
];

exports.signUp = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Input passed please check your data.", 422)
    );
  }
  console.log(req.body)

  const { name, email, password } = req.body;

  const hashedPw = await  bcrypt.hash(password, 12);

  try{
    const check = await User.findOne({email:email});
    // console.log(check)

    if (check) {
        return next(new HttpError("This user already exist.", 422));
      }
    
     const user =  new User({
        name,
        email,
        password:hashedPw,
        image:'https://media.cntraveler.com/photos/61eae294c43ef397991bf238/master/w_1920%2Cc_limit/British%2520Virgin%2520Islands_GettyImages-973996210.jpg',
        places:[]
     });

     const result = await user.save();
    
      res.status(201).json({ result});

  }catch(err){
    const error = new HttpError('Something went wrong could not create user',500)
      next(error);
      
  }
  
};

// exports.signIn = (req, res, next) => {
//   const { email, password } = req.body;
//   const check = DUMMY_USERS.find((user) => user.email === email);
//   const check2 = DUMMY_USERS.find((user) => user.password === password);

//   if (!check && !check2) {
//     return next(new HttpError("Wrong email and password.", 404));
//   }

//   res.status(200).json({ message: "connected" });
// };

exports.getUsers = async(req, res, next) => {

     try{

        const users = await User.find({},'-password');
        console.log(users)

        if(!users){
            return next( new HttpError('Cound not find users',404));
        }

        res.status(200).json({users})
     }catch(err){
        const error = new HttpError('Something went wrong could not find users',500)
        next(error);
     }

};
