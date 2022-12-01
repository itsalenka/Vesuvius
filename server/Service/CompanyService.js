const sequelize = require("../db")
const ApiError = require("../Error/ApiError");
const userService = require('../Service/UserService')
const UserInfoDto = require("../DTO/UserInfoDto");
const CompanyInfoDto = require("../DTO/UserInfoDto");
const {Company, User} = require('../Model/models').Models(sequelize)

class CompanyService {
    async getById(id){
        const dataCompany = await Company.findByPk(id,
            {
                include: [{ model: User, as: 'users', required: true, where: {
                        role: 'CUSTOMER'
                    }}]
            })
        if(!dataCompany) throw ApiError.NotFound()
        return dataCompany
    }

    async getByIdCompany(id){
        const dataCompany = await Company.findByPk(id)
        if(!dataCompany) throw ApiError.NotFound()
        return dataCompany
    }

    async update(id, company){
        const dataUp = await Company.update({country: company.country, state: company.state, city: company.city, director: company.director, bankInfo: company.bankInfo, address: company.address}, {where: {id: id}})
        return dataUp
    }

    async getInfo(id){
        return await Company.findByPk(id)
    }

}

module.exports = new CompanyService()