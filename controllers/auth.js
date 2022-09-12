const bcrypt = require('bcryptjs');

const jwt  = require('jsonwebtoken');

const User = require('../models/user');

const HttpError = require("../models/http-error");


const getToken= (user)=>{
    return  jwt.sign({email:user.email,userId:user._id.toString()},'thisIsTheSecrete',{expiresIn:'1h'})
   }

exports.signIn = async(req, res, next) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.findOne({email:email});
       

        if (!user) {
            return next(new HttpError("A user with this email could not be found.", 404));
          }

          const compare = await bcrypt.compare(password,user.password);

          console.log( compare)

          if (!compare) {
            return next(new HttpError("wrong email or password.", 401));
          }

          const token =getToken(user);

          res.status(200).json({token});
          

    }catch(err){
        const error = new HttpError('Something went wrong could not authenticate',500)
        next(error);
    }
  
  };
  
  