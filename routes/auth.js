const express = require('express');
const router = express.Router();
const { body,query, validationResult } = require('express-validator');
const userController = require('../controller/userController');
const fetchUser = require('../middleware/fetchuser');

router.use(express.json());

router.get('/', (req, res) => {
    let obj = req.body;
    res.json(
        {
            "help": obj
        }
    );
})

//Route 1: Check email is already exist or not using POST "/api/auth/check_email"

router.post('/check_email',[
    query('email','Email is not valid').isEmail()
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.json(
        await userController.checkEmail(req)
    );
});

//Route 3: Create a user using POST "/api/auth/register". No login required

router.post('/register', [
    body('name', 'The length of name should be minimum 3 and maximum 20').isLength({ min: 3, max: 30 }),
    body('email', 'The minumum legth of password should be 5').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {

    // If there are error in body we return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.json(
        await userController.registerUser(req)
    );
});

// Route 3: login a user using POST "/api/auth/login". No login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password',"Password cannot be blanked").exists()
],async (req, res) => {
    // If there are error in body we return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.json(
        await userController.loginUser(req)
    );
});


// Route 4: Get user details using POST "/api/auth/getuser". Login required

router.post('/getuser',fetchUser,async (req,res)=>{
    res.json(
        await userController.getUser(req)
    );
});

module.exports = router;