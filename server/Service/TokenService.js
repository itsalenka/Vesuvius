const jwt = require("jsonwebtoken");
const sequelize = require("../db");
const {Token} = require('../Model/models').Models(sequelize)

class TokenService{
    generateTokens (payload) {
        const accessToken = jwt.sign( payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: "1h"})
        const refreshToken = jwt.sign( payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: "30d"})
        return {accessToken, refreshToken}
    }

    async saveToken(userId, refreshToken){
        let token = await Token.findOne({where: {userId}})
        if(token){
            await Token.update({ refreshToken: refreshToken }, {
                where: {userId: userId}
            });
        } else{
            await Token.create({userId: userId, refreshToken: refreshToken});
        }
        //await Token.upsert({userId: userId, refreshToken: refreshToken})
    }

    async removeToken(refreshToken){
        const tokenData = await Token.destroy({where: {refreshToken}})
        return tokenData
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)
            console.log(userData)
            return userData
        }catch (e) {
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
            return userData
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken){
        const tokenData = await Token.findOne({where: {refreshToken}})
        return tokenData
    }

    async removeByUser(id){
        const tokenData = await Token.destroy({where: {userId: id}})
        return tokenData
    }


}

module.exports = new TokenService()