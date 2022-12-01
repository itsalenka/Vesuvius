const truckService = require("../Service/TruckService");
const ListTruckDto = require("../DTO/ListTruckDto");
const TruckInfoDto = require("../DTO/TruckInfoDto");

module.exports = {
    createTruck: async (req, res, next) => {
        const data = await truckService.create(req.body,  req.user.company)
        return res.json(data)
    },

    updateTruck: async (req, res, next) => {
        const data = await truckService.update(req.params.id, req.body)
        return res.json(data)
    },

    getById: async (req, res, next) => {
        const data = await truckService.findById(req.params.id)
        return res.json(new TruckInfoDto(data.dataValues))
    },

    getMyTrucks: async (req, res, next) => {
        const data = await truckService.findByCompany(req.user.company)
        let dataDto = []
        data.forEach(el => {
            dataDto.push(new ListTruckDto(el.dataValues))
        })

        return res.json(dataDto)
    },

    deleteTruck: async (req, res, next) => {
        const data = truckService.delete(req.params.id);
        return res.json(data)
    },

    getFreeTrucks: async (req, res, next) => {
        const data = await truckService.findFree(req.user.company);
        let dataDto = []
        data.forEach(el => {
            dataDto.push(new ListTruckDto(el.dataValues))
        })
        return res.json(dataDto)
    }
}