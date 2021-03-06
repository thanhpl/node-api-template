const response = require('../util/response');
const authService = require('../services/authService');
const logger = require('../common/logger')('ApiAuth');

function authAPI(options) {
    let opts = options || {};

    return async (req, res, next) => {
        try {
            let headers = req.headers;
            let authorization = headers.authorization;
            if (authorization === undefined) {
                response.sendUnauthorized(res);
                return;
            }

            let splits = authorization.split('Bearer');
            if (splits.length !== 2 || splits[1].trim().length === 0) {
                response.sendUnauthorized(res);
                return;
            }

            let token = splits[1].trim();

            // Verify token by decoding token
            try {
                let payload = authService.verifyToken(token);

                // Assign user data from token
                req.user = payload.user;
            } catch (verifyErr) {
                response.sendUnauthorized(res);
                return;
            }

            next();
        } catch (err) {
            logger.error(`Authenticate failed, ${err.stack}`);
            response.sendError(res, err);
            return;
        }
    };
}

module.exports = authAPI;
