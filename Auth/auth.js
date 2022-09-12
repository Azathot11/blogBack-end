const jwt = require('jsonwebtoken');

const getToken= (user)=>{
    return  jwt.sign({name:user.name,userId:user._id.toString()},'thisIsTheSecrete',{expiresIn:'1h'})
   }