// Importing packages
const jwt = require('jsonwebtoken');

// Middleware function for authorization
module.exports = (req, res, next) => {
    try {
        // Checking headers
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        // console.log(req.headers);
        if (token == "undefined") {
            res.status(401).send('Access denied! No token provided');
        } else {
            // verifying headers
            let decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.decoded = decoded;
            next();
        }
    } catch (err) {
        res.send(err);
    }
}