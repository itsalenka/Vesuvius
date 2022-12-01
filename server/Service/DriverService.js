const sequelize = require("../db")
const ApiError = require("../Error/ApiError");
const userService = require('../Service/UserService')
const UserInfoDto = require("../DTO/UserInfoDto");
const {Company, User, Truck} = require('../Model/models').Models(sequelize)

class DriverService {
    async getByCompany(id){
        const dataCompany = await User.findAll(
            {
                include: [{ model: Truck, as: 'truck', required: true},
                    {model: Company, as: 'company', required: true, where: {id: id}
                    }]
            })
        if(!dataCompany) throw ApiError.NotFound()
        return dataCompany
    }

    // async update(id, company){
    //     const dataUp = await MyCompany.update({name: company.nameCompany, director: company.director, phoneNumber: company.phoneNumber, bankInfo: company.bankInfo, address: company.address}, {where: {id: id}})
    //     return dataUp
    // }
}
