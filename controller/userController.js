const User = require('../models/User');
const passHash = require('../helper/passHash');
const Secret = require('../models/Secret');
const sendMail = require('../helper/emailSender');

class UserController {

    async checkEmail(req) {
        // Check whether the user email already exists.
        let response = { 'error': false }
        try {
            let email = req.query.email
            let user = await User.findOne({ email });
            if (user) {
                response = {
                    'error': true,
                    'message': "Email already exists"
                };
            } else {
                return this.createNewSecret(email);
            }
        } catch (error) {
            console.error(error.message)
            response = {
                'error': true,
                'message': 'Internal server error'
            };
        }
        return response;
    }

    async createNewSecret(email) {

        try {
            let otp = getRandomInt(100000, 999999);
            let secret = await Secret.findOne({ email });
            if (secret) {
                await Secret.deleteOne({ email });
            }
            await Secret.create({
                email, otp
            }).then(()=>{
                sendMail(email,otp);
            });
            return {
                'error': false,
                'message': "An otp has been send to your email"
            }
        } catch (error) {
            console.log(error.message)
            return {
                'error': true,
                'message': "Error sending the otp"
            }
        }
    }

    async verifyOtp(email,otp){
        let response = {'error':false}
        try{
            let secret = await Secret.findOne({ email });
            if(!secret){
                response = {
                    'error':true,
                    'message':'Invalid otp'
                }
            }else{
                let storedOtp = secret.otp;
                if(storedOtp == otp){
                    let createdAt = secret.created_at;
                    let createAtTime = Math.floor((createdAt.getTime())/1000);
                    let now = Math.floor((Date.now())/1000);
                    let diff = 900
                    if((now-createAtTime)>diff){
                        response = {
                            'error':true,
                            'message':'Otp is expired'
                        }
                    }else{
                        await Secret.deleteOne({ email });
                        response = {
                            'error':false,
                            'message':'Otp verified'
                        }
                    }
                }else{
                    response = {
                        'error':true,
                        'message':'Invalid otp'
                    }
                }
            }
        }catch(error){
            console.error(error.message)
            response = {
                'error':true,
                'message':'Error verifying the otp'
            }
        }
        return response;
    }

    async registerUser(req) {
        let response = { 'error': false };
        try {
            // Check whether the user email already exists.
            let resp = await this.verifyOtp(req.body.email,req.body.otp)
            if(resp['error']){
                return resp;
            }
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                response = {
                    'error': true,
                    'message': "Email already exists"
                };
            } else {
                user = await User.create({
                    name: req.body.name,
                    password: await passHash.genHash(req.body.password),
                    email: req.body.email
                });
                response = {
                    'error': false,
                    'message': 'User created successfully',
                    'api_key': passHash.getApiKey(user.id)
                };
            }
        } catch (error) {
            console.error(error.message)
            response = {
                'error': true,
                'message': 'Internal server error'
            };
        }
        return response;
    }

    async loginUser(req) {
        let response = {
            'error': true,
            'message': "Login failed, error credentials"
        };
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user)
                return response;
            if (!(await passHash.checkPass(password, user.password))) {
                return response;
            }
            response = {
                'error': false,
                'message': 'Login successfull.',
                'api_key': passHash.getApiKey(user.id)
            };
        } catch (error) {
            console.error(error.message)
            response = {
                'error': true,
                'message': 'Internal server error'
            };
        }
        return response;
    }

    async getUser(req) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password -__v");
            return {
                'error': false,
                'user': user
            }
        } catch (error) {
            console.error(error.message)
            return {
                'error': true,
                'message': 'Internal server error'
            };
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = new UserController();