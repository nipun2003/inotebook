const jwt = require('jsonwebtoken');
const WEB_TOKEN = process.env.WEB_TOKEN_SIGN

const fetchUser = (req, res, next) => {
    // Get the user from jwt token and add id to req object

    const token = req.header('Authorization');
    if (!token)
        return res.status(401).json({
            'error': true,
            'message': 'Session token missing'
        })
    try {
        const data = jwt.verify(token, WEB_TOKEN);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({
            'error': true,
            'message': 'Invalid session token'
        })
    }
}
module.exports = fetchUser