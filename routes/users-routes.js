const express =require('express');
const {check} = require('express-validator');
const userControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload')


const router = express.Router()

router.post('/signUp',fileUpload.single('image'),userControllers.signUp);
router.get('/getUsers',userControllers.getUsers);

module.exports = router;  