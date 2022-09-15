const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');
const authRoutes = require('./routes/auth-routes');
const HttpError = require('./models/http-error');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8081

app.use(cors());
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/auth',authRoutes);
app.use('/user',usersRoutes);
app.use('/api',placesRoutes);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((req,res,next)=>{
    const error = new HttpError('Could note find this route.',404)
    throw error
})
app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            console.log(err);
        })
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message || 'An unknowm weeoe occured'})
})


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@blog.wmfw5ph.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`).then(result=>{
    app.listen(port);
}).catch(err=>{
    console.log(err);
})