const sequelize = require('../db')
const { Op } = require("sequelize");
const RequestDto = require("../DTO/ListRequestDto");
const typeService = require('./TypeTruckService')
const adrService = require('../Service/ADRService')
const ApiError = require("../Error/ApiError");
const {Request, ADR, TypeTruck, User, Company} = require('../Model/models').Models(sequelize)


class RequestService{
    async findAllByUser(id) {
        return await Request.findAll({
            where: { [Op.or]: [
                    { driverId: id },
                    { customerId: id },
                    { carrierId: id }
                ]},
            include: [{ model: ADR, as: 'ADR', required: true},
                { model: TypeTruck, as: 'typeTruck', required: true}]
        })
    }

    async findAllFree() {
        const data = await Request.findAll({ where:
                {[Op.and]: [
                        {dateUnloading: {
                                [Op.gte]: new Date().toLocaleDateString('en-CA')
                            }
                        },
                        {carrierId: null}]},
            include: [{ model: ADR, as: 'ADR',required: true},
                { model: TypeTruck, as: 'typeTruck', required: true}]
        })
        let dataDto = []
        data.forEach(el => {
            dataDto.push(new RequestDto(el.dataValues))
        })
        return JSON.stringify(dataDto)
    }

    async create(data, id) {
        const {dateLoading, dateUnloading, WRCity, WCity, WRCountry, WRAddress, WAddress, WCountry, WRState, WState, weight, volume, typeTruck, typeLoading, typeUnloading, cargo, rate, ADR, note, loadLimit} = data
        const typeId = await typeService.getId(typeTruck)
        const adrId = await  adrService.getId(ADR)
        const res  = await Request.create({dateLoading, dateUnloading, WRCity, WCity, WRAddress, WAddress, WRCountry, WCountry, WRState, WState, weight, volume, typeTruckId: typeId, typeLoading, typeUnloading, cargo, rate, ADRId: adrId, note: note, loadLimit, customerId: id})
        return res
    }

    async update(idReq, data) {
        const result = await Request.update(data, {where: {id: idReq}}).catch((err) => {
            throw new ApiError.BadRequest('Request has deleted')
        })
        return {message: 'Success'}
    }

    async delete(id) {
        const result =  await Request.destroy({
            where: {
                id: id
            },
            force: true
        }).catch((err) => {
            throw new ApiError.BadRequest('Request has deleted')
        })
        return {message: 'Success'}
    }

    async findById(id){
        const res = await Request.findByPk(id, {
            include: [{ model: ADR, as: 'ADR', required: true},
                { model: TypeTruck, as: 'typeTruck', required: true},
                {model: Company, as: 'customer', required: true, include: {
                        model: User, as: 'users', required: true, where: {role: 'CUSTOMER'}
                    }},
                { model: User, as: 'driver'}]
        })
        return  res
    }

    async getUser(id){
        return await Request.findByPk(id, {
            include: [{ model: Company, as: 'customer', required: true, include: {
                    model: User, as: 'users', required: true, where: {role: 'CUSTOMER'}
                }}]})
    }
}

module.exports = new RequestService()