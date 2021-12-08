const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const WEB_TOKEN = process.env.WEB_TOKEN_SIGN

class PassHash {
    async genHash(password) {
        let salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async checkPass(password, hash) {
        return bcrypt.compare(password, hash);
    }

    getApiKey(id) {
        const data = {
            user: {
                id: id
            }
        }
        return jwt.sign(data, WEB_TOKEN);
    }
}

module.exports = new PassHash();




