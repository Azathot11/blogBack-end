const express =require('express');
const {check} = require('express-validator');
const userControllers = require('../controllers/users-controllers')


const router = express.Router()

router.post('/signUp',[
    check('name').trim().not().isEmpty(),
    check('email').trim().normalizeEmail().isEmail(),
    check('password').trim().isLength({min:7}),
    check("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("password and confirmPassword are not identical");
        }
        return true;
      }),
],userControllers.signUp);
router.get('/getUsers',userControllers.getUsers);

module.exports = router;  