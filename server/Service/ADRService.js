const sequelize = require("../db");
const {ADR} = require('../Model/models').Models(sequelize)

class ADRService {
    async getAll() {
        const data = await ADR.findAll()
        return data
    }

    async getId(name) {
        const adr = await ADR.findOne({where: {name}})
        return adr.id
    }

}

module.exports = new ADRService()