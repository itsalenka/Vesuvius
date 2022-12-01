const sequelize = require("../db")
const ApiError = require("../Error/ApiError");
const typeService = require('./TypeTruckService')
const {TypeTruck, User, Truck, Company} = require('../Model/models').Models(sequelize)

class TruckService {
    async findByCompany(id){
        const data = await Truck.findAll(
            {
                where: {companyId: id},
                include: [{ model: TypeTruck, as: 'typeTruck', required: true},
                    {model: User, as: 'driver'}]
            }
        )
        if(!data) throw ApiError.NotFound()
        return data
    }

    async create(data, companyId){
        const {maxWeight, maxVolume, number, brand, model, year, typeTruck, isPearLoading, isSideLoading, isUpLoading, notes} = data
        const typeTruckId = await typeService.getId(typeTruck)
        const res  = await Truck.create({maxWeight, maxVolume, number, brand, model, year, typeTruckId, isPearLoading, notes, isSideLoading, isUpLoading, companyId})
        return res
    }

    async update(id, data){
        if(data.typeTruck) {
            data.typeTruckId = await typeService.getId(data.typeTruck)
            delete data.typeTruck;
        }
        const res = await Truck.update(data, {where: {id: id}})
        return res
    }

    async findById(id){
        const res = await Truck.findByPk(id, {
            include: [{ model: TypeTruck, as: 'typeTruck', required: true},
                {model: User, as: 'driver'}]
        })
        return  res
    }

    async delete(id){
        const result =  await Truck.destroy({
            where: {
                id: id
            },
            force: true
        }).catch((err) => {
            throw new ApiError.BadRequest('Truck has deleted')
        })
        return {message: 'Success'}
    }

    async findFree(companyId){
        return await Truck.findAll(
            {
                where: {driverId: null, companyId},
                include: { model: TypeTruck, as: 'typeTruck', required: true}
            }
        )
    }
}

module.exports = new TruckService()