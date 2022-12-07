const requestService = require('../Service/RequestService')
const RequestDto = require("../DTO/ListRequestDto")
const AllRequestDto = require("../DTO/RequestInfoDto")
const WebSocket = require("ws");
const ApiError = require("../Error/ApiError");
const companyService = require('../Service/CompanyService')
const userService = require('../Service/UserService')
const mailService = require('../Service/Mail/MailService')

module.exports = {
    create: async (req, res) => {
        const { wss } = req.app.locals;
        const data = await requestService.create(req.body,  req.user.id)
        await sendBroadcast(wss)
        return res.json(data)
    },

    update: async (req, res, next) => {
        try {
            const id = req.params.id
            let dataBody = req.body
            if(dataBody.driverId){
                dataBody.carrierId = req.user.id
            }
            const data = await requestService.findById(id)
            if (!data)
                return next(ApiError.BadRequest('The request has deleted'))
            // if (data.carrier != null)
            //     return next(ApiError.BadRequest('The request is already accepted'))
            const dataRes = await requestService.update(req.params.id, dataBody)
            if(dataBody.driverId) {
                const {wss} = req.app.locals;
                await sendBroadcast(wss)
                const companyInfo = await companyService.getByIdCompany(req.user.company)
                const userInfo = await userService.getUserInfo(req.user.id)
                const driverInfo = await userService.getUserInfo(dataBody.driverId)
                const dataReq = await requestService.getUser(req.params.id)
                await mailService.sendInformationMail(dataReq.dataValues.customer.dataValues.users[0].dataValues.email, companyInfo.dataValues, driverInfo.dataValues, userInfo.dataValues, id)
            }
            return res.json(dataRes)
        }
        catch (e){
            console.log(e.message)
            next(e)
        }
    },

    delete: async (req, res, next) => {
        try {
            const data = await requestService.delete(req.params.id)
            const {wss} = req.app.locals;
            await sendBroadcast(wss)
            return res.json(data)
        }catch (e){
            next(e)
        }
    },

    findAllFree: async() =>{
        return await requestService.findAllFree()
    },

    findAllByUser: async(req, res) =>{
        const data = await requestService.findAllByUser(req.user.id)
        let dataDto = []
        data.forEach(el => {
            dataDto.push(new RequestDto(el.dataValues))
        })
        console.log(data)
        return res.json(dataDto)
    },

    getById: async (req, res, next) => {
        const data = await requestService.findById(req.params.id)
        const companyCarrier = null
        const userCarrier = null
        if(data.dataValues.carrierId) {
            await companyService.getByIdCompany(data.dataValues.carrierId)
            await userService.getUserCarrier(data.dataValues.carrierId)
        }
        let dataDto = new AllRequestDto(data, companyCarrier, userCarrier, req.user.role, req.user.id, req.user.company)
        return res.json(dataDto)
    }
}

sendBroadcast = async (wss) => {
    wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(await requestService.findAllFree())
        }
    })
}