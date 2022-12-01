const sequelize = require("../db")
const bcrypt = require("bcrypt")
const uuid = require('uuid')
const {User, Company, Truck, Request} = require('../Model/models').Models(sequelize)
const ApiError = require('../Error/ApiError')
const mailService = require('../Service/Mail/MailService')
const tokenService = require('../Service/TokenService')
const UserDto = require('../DTO/UserDto')
const UserInfoDto = require("../DTO/UserInfoDto");
const {Op} = require("sequelize");

class UserService {
    async registration(body){
        let {email, password, role, name, nameCompany, director, phoneNumber, country, state, city, bankInfo, address} = body
        bankInfo = bankInfo || null
        address = address || null
        const candidate = await User.findOne({where: {email}})
        if (candidate)
            throw ApiError.BadRequest('Exist email')

        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()
        const t = await sequelize.transaction();
        try {
            const company = await Company.create({
                name: nameCompany,
                director,
                city,
                country,
                state,
                bankInfo,
                address,
                email
            }, {transaction: t})
            console.log(`New company has been created with Id: ${company.id}`);
            const user = await User.create({
                email,
                password: hashPassword,
                role,
                companyId: company.id,
                activationLink,
                phoneNumber,
                name,
                isActivated: false
            }, {transaction: t})
            console.log(`New user has been created with Id: ${user.id}`);
            await mailService.sendActivationMail(email, `${process.env.API_URL}/users/activate/${activationLink}`)
            await t.commit()
            console.log(`Activate message has been sent`);
            return {message: 'Activate your account by mail'}
        }catch (e){
            await t.rollback()
            console.error(`Registration error: ${e.message}`)
            throw new ApiError.BadRequest('Error registration')
        }
    }

    async activate (activationLink){
        const user = await User.findOne({where: {activationLink}})
        if(!user)
            throw ApiError.BadRequest('Invalid activation link')
        const userData = await User.update({isActivated: true}, {where: {id: user.id}})
    }

    async login(email, password){
        const user = await User.findOne({where: {email}})
        if (!user)
            throw ApiError.BadRequest('User not found')
        if (!user.isActivated)
            throw ApiError.BadRequest('Inactive account')
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword)
            throw ApiError.BadRequest('Invalid password')
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async check(id){
        const user = await User.findByPk(id)
        if (!user)
            throw ApiError.BadRequest('User not found')
        if (!user.isActivated)
            throw ApiError.BadRequest('Inactive account')
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const data = tokenService.removeToken(refreshToken)
        return data
    }

    async refresh(refreshToken){
        if (!refreshToken)
            throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async getById(id){
        return await User.findByPk(id)
    }

    async comparePassword(id, password){
        const user = await User.findByPk(id)
        if (!user)
            throw ApiError.BadRequest('User not found')
        if (!user.isActivated)
            throw ApiError.BadRequest('Inactive account')
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword)
            throw ApiError.BadRequest('Invalid password')
    }

    async update(id, email, name, phoneNumber, password, oldEmail){
        if (password != null) {
            const hashPassword = await bcrypt.hash(password, 5)
            const userData = await User.update({password: hashPassword, name, phoneNumber}, {where: {id: id}})
            return {message: 'Success'}
        }
        if (email !== oldEmail) {
            const activationLink = uuid.v4()
            const userData = await User.update({email: email, name, phoneNumber, isActivated: false, activationLink: activationLink}, {where: {id: id}})
            await mailService.sendActivationMail(email, `${process.env.API_URL}/users/activate/${activationLink}`)
            return {message: 'Activate your account by email'}
        } else {
            const userData = await User.update({name, phoneNumber}, {where: {id: id}})
            return {message: 'Success'}
        }
    }

    async getInfo(id){
        return await User.findByPk(id, {incude: {model: Company, as: 'company', required: true}})
    }

    async getDrivers(id){
        return User.findAll({where: {companyId: id, role: 'DRIVER'},
            include: { model: Truck, as: 'truck'}})
    }

    async getDriver(id){
        return User.findByPk(id, {include: { model: Truck, as: 'truck'}})
    }

    async getUserInfo(id){
        return User.findByPk(id)
    }

    async getUserCarrier(id){
        return User.findOne({where: {
            role: 'CARRIER',
                companyId: id
            }})
    }

    async delete(id){
        const result =  await User.destroy({
            where: {
                id: id
            },
            force: true
        }).catch((err) => {
            throw new ApiError.BadRequest('Driver has deleted')
        })
        return {message: 'Success'}
    }

    async getFreeDrivers(companyId){
        const trucksWithDrivers = await Truck.findAll(
            {
                where: {driverId: {
                        [Op.ne]: null
                    }, companyId}
            }
        )

        let ids = []
        trucksWithDrivers.forEach(el => {
            ids.push(el.driverId);
        })

        return await User.findAll({where: {companyId, id: {
            [Op.notIn]: ids}
        }})
    }

    async getFreeDriversByDates(companyId, dateLoad, dateUnload){
        const reqsWithDrivers = await Request.findAll(
            {
                where: {driverId: {
                        [Op.ne]: null
                    }, [Op.or]: [
                        {dateLoading: {[Op.between]: [dateLoad, dateUnload]}},
                        {dateUnloading: {[Op.between]: [dateLoad, dateUnload]}},
                        {[Op.and]:[{dateLoading: {[Op.lte]: dateLoad}},
                                {dateLoading: {[Op.gte]: dateUnload}}]}
                    ], customerId: companyId}
            }
        )
        let ids = []
        reqsWithDrivers.forEach(el => {
            ids.push(el.driverId);
        })
        return await User.findAll({where: {companyId,
                role: 'DRIVER',
                id: {
                    [Op.notIn]: ids}
            }})
    }

    async createDriver(body, companyId){
        let {email, password, role, name, phoneNumber} = body
        const candidate = await User.findOne({where: {email}})
        if (candidate)
            throw ApiError.BadRequest('Exist email')

        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()
        const t = await sequelize.transaction();
        try {

            const user = await User.create({
                email,
                password: hashPassword,
                role,
                companyId,
                activationLink,
                phoneNumber,
                name,
                isActivated: false
            }, {transaction: t})
            console.log(`New user has been created with Id: ${user.id}`);
            await mailService.sendActivationMail(email, `${process.env.API_URL}/users/activate/${activationLink}`)
            await t.commit()
            console.log(`Activate message has been sent`);
            return {message: 'Activate your account by mail'}
        }catch (e){
            await t.rollback()
            console.error(`Registration error: ${e.message}`)
            throw new ApiError.BadRequest('Error creation driver')
        }
    }
}

module.exports = new UserService()