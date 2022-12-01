const typeService = require('../Service/TypeTruckService')
const ADRService = require('../Service/ADRService')
module.exports = {
    getAll: async (req, res, next) => {
        try {
            const dataTypes = await typeService.getAll()
            const dataADRs = await ADRService.getAll()
            const data = {typesTruck: dataTypes, ADRs: dataADRs}
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
}