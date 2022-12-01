const companyService = require('../Service/CompanyService')
const userService = require('../Service/UserService')
const driverService = require("../Service/DriverService")
const truckService = require("../Service/TruckService")
const ListTruckDto = require("../DTO/ListTruckDto");
const CompanyInfoDto = require("../DTO/CompanyInfoDto");
const {validationResult} = require("express-validator");
const ApiError = require("../Error/ApiError");

module.exports = {
    updateMy: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error: ' +  errors.array()[0].msg.toString()))
            }
            const userData = await userService.getById(req.user.id)
            const dataComp = await companyService.update(userData.companyId, req.body)
            const data = await userService.getInfo(req.user.id)
            res.json(data)
        }catch (e) {
            next(e)
        }
    },

    // findDrivers: async (req, res, next) => {
    //     const data = await driverService.getByCompany(req.user.id)
    //
    //     let dataDto = []
    //     data.forEach(el => {
    //         dataDto.push(new ListTruckDto(el.dataValues))
    //     })
    //     return res.json(dataDto)
    // },
    //
    // findTrucks: async (req, res, next) => {
    //     const data = await truckService.getByCompany(req.user.id)
    //     let dataDto = []
    //     data.forEach(el => {
    //         dataDto.push(new ListTruckDto(el.dataValues))
    //     })
    //     return res.json(dataDto)
    // },

    // createTruck: async (req, res, next) => {
    //     const data = await truckService.create(req.body,  req.user.company)
    //     return res.json(data)
    // },
    //
    // createDriver: async (req, res, next) => {
    //     const data = await truckService.create(req.body,  req.user.company)
    //     return res.json(data)
    // }

    getMy: async(req, res, next) => {
        try {
            const user = await userService.getById(req.user.id)
            const company = await companyService.getInfo(user.companyId)
            console.log(company)
            res.json(new CompanyInfoDto(company.dataValues))
        } catch (e){
            console.log(e)
            next(e)
        }
    },

}