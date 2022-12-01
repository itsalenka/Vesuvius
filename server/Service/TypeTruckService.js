const sequelize = require("../db");
const {TypeTruck} = require('../Model/models').Models(sequelize)

class TypeTruckService {
    async getAll() {
        const data = await TypeTruck.findAll()
        return data
    }

    async getId(name) {
        const type = await TypeTruck.findOne({where: {name}})
        return type.id
    }
}

module.exports = new TypeTruckService()