const jwt = require('jsonwebtoken')
const ApiError = require('../Error/ApiError')
const tokenService = require('../Service/TokenService')
const {Ability, AbilityBuilder} = require('casl');
const {rules, can} = AbilityBuilder.extract();

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
        if (userData.role === 'CUSTOMER')
        {
            can(['delete'], ['Request'], {customerId: userData.id})
            can(['create'], ['Request'])
        }
        if (userData.role === 'CARRIER')
        {
            can(['create'], ['User'])
            can(['update'], ['Request'])
        }
        if (userData.role === 'DRIVER')
        {
            can(['read'], ['Truck'], {companyId: userData.company})
            can(['delete'], ['Truck'], {companyId: userData.company})
            can(['update'], ['Truck'], {companyId: userData.company})
            can(['create'], ['Truck'])
            can(['read'], ['Driver'], {companyId: userData.company})
            can(['delete'], ['Driver'], {companyId: userData.company})
            can(['update'], ['Driver'], {companyId: userData.company})
            can(['create'], ['Driver'])
            can(['update'], ['Request'], {driverId: userData.id})
        }
        req.user = userData
        req.ability = new Ability(rules);
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}


