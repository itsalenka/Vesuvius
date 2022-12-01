const sequelize = require('../db')
const {Users, Companies} = require('../Model/models').Models(sequelize)
const ApiError = require('../Error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userService = require('../Service/UserService')
const {validationResult} = require('express-validator')
const UserInfoDto = require("../DTO/UserInfoDto");
const ListDriverDto = require("../DTO/ListDriverDto");
const DriverInfoDto = require("../DTO/DriverInfoDto");
const ListTruckDto = require("../DTO/ListTruckDto");

module.exports = {
    registration: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error: ' +  errors.array()[0].msg.toString()))
            }
            const userData = await userService.registration(req.body)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    },

    login: async (req, res, next) => {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            console.log("Response: ", res);
            return res.json(userData)
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    logout: async (req, res, next) => {
        try {
            const {refreshToken} = req.body
            const token = userService.logout(refreshToken)
            return res.json(token)
        } catch (e) {
            next(e)
        }
    },

    refresh: async (req, res, next) => {
        try {
            const refreshToken= req.headers.authorization.split(' ')[1]
            const userData = await userService.refresh(refreshToken)
            return res.json(userData)
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    activate: async (req, res, next) => {
        try {
            const activateLink = req.params.link
            await userService.activate(activateLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    updateMy: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error: ' +  errors.array()[0].msg.toString()))
            }
            const {email, name, phoneNumber, password, passwordRep, passwordOld} = req.body
            if (password != undefined && passwordOld != undefined) {
                if (password !== passwordRep)
                    return next(ApiError.BadRequest('Validation error: passwords don\'t match'))
                if (password.length < 3 || password.length > 30)
                    return next(ApiError.BadRequest('Validation error: invalid password'))
                await userService.comparePassword(req.user.id, passwordOld)
            }
            const dataUser = await userService.update(req.user.id, email, name, phoneNumber, password, req.user.email)
            return res.json(dataUser)
        } catch (e) {
            if (e instanceof ApiError) {
                return next(e)
            }
            else return next(ApiError.BadRequest('This email already exist '))
        }
    },

    getMy: async(req, res, next) => {
        try {
            const user = await userService.getInfo(req.user.id)
            res.json(new UserInfoDto(user.dataValues))
        } catch (e){
            console.log(e)
            next(e)
        }
    },

    getMyDrivers: async(req, res, next) => {
        try {
            const data = await userService.getDrivers(req.user.company)
            let dataDto = []
            data.forEach(el => {
                dataDto.push(new ListDriverDto(el.dataValues))
            })
            return res.json(dataDto)
        } catch (e){
            console.log(e)
            next(e)
        }
    },

    getFreeDrivers: async(req, res, next) => {
        try {
            const {dateUnload, dateLoad} = req.body
            let data = []
            if(dateUnload && dateLoad) {
                data = await userService.getFreeDriversByDates(req.user.company, dateLoad, dateUnload)
            } else  {
                data = await userService.getFreeDrivers(req.user.company)
            }
            let dataDto = []
            console.log(data)
            data.forEach(el => {
                dataDto.push(new ListDriverDto(el.dataValues))
            })
            return res.json(dataDto)
        } catch (e){
            console.log(e)
            next(e)
        }
    },

    getDriver: async(req, res, next) => {
        try {
            const driver = await userService.getDriver(req.params.id)
            res.json(new DriverInfoDto(driver.dataValues))
        } catch (e){
            console.log(e)
            next(e)
        }
    },

    createDriver: async(req, res, next) => {
        try{
            console.log(req.user.company)
            const data = userService.createDriver(req.body, req.user.company)
            res.json(data)
        } catch(e){
            console.log(e)
            next(e)
        }
    },

    deleteDriver: async(req, res, next) => {
        const data = userService.delete(req.params.id);
        return res.json(data)
    },

    auth: async(req, res, next) => {
        res.json('ok');
    }

}