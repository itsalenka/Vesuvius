const jwt = require('jsonwebtoken')
const ApiError = require('../Error/ApiError')
const tokenService = require('../Service/TokenService')

module.exports = function (req, res, next) {
    if(req.method === "OPTIONS") {
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(!token)
            return next(ApiError.UnauthorizedError())
        const userData = tokenService.validateAccessToken(token)
        if (!userData)
            return next(ApiError.UnauthorizedError())
        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}